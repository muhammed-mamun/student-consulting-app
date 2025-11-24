const supabase = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');
const { sendPushNotification } = require('../services/pushNotificationService');

/**
 * Create appointment
 */
const createAppointment = async (req, res) => {
  try {
    const { uid } = req.user;
    const { advisorId, appointmentDate, appointmentTime, issueCategory, issueDescription } = req.body;

    console.log("1. Received Request:", { advisorId, appointmentDate, appointmentTime });

    // 1. Get student user ID
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (studentError || !student) {
      console.error("User lookup failed:", studentError);
      return res.status(404).json({
        success: false,
        message: 'Student user profile not found',
      });
    }

    // 2. Check if time slot is available
    // CHANGED: Removed .single() to avoid "JSON object requested, multiple (or no) rows returned" errors
    const { data: existingAppointments, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('advisor_id', advisorId)
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', appointmentTime)
      .in('status', ['Pending', 'Accepted']);

    if (checkError) {
      console.error("Availability check failed:", checkError);
      return res.status(500).json({ success: false, message: 'Error checking availability' });
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked',
      });
    }

    // 3. Create appointment
    // Note: If this fails with a 400, it is likely the deep .select() syntax or Date/Time format
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert({
        student_id: student.id,
        advisor_id: advisorId,
        appointment_date: appointmentDate, // Ensure YYYY-MM-DD
        appointment_time: appointmentTime, // Ensure HH:MM:SS
        issue_category: issueCategory,
        issue_description: issueDescription,
        status: 'Pending',
      })
      .select(`
        *,
        advisors:advisor_id (
          id,
          department,
          designation,
          users:user_id (
            first_name,
            last_name,
            email
          )
        ),
        students:student_id (
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      // LOG THE ACTUAL ERROR TO YOUR SERVER CONSOLE
      console.error("Supabase Insert Error Details:", JSON.stringify(error, null, 2));

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create appointment',
        // Optional: Return strict details only in development
        code: error.code,
        details: error.details
      });
    }

    // 4. Create notification for advisor and send push notification
    // We wrap this in a try/catch so it doesn't crash the response if notification fails
    try {
      const { data: advisorUser } = await supabase
        .from('advisors')
        .select('user_id, users:user_id(push_token, email)')
        .eq('id', advisorId)
        .single();

      if (advisorUser) {
        // Create in-app notification
        await supabase
          .from('notifications')
          .insert({
            user_id: advisorUser.user_id,
            appointment_id: appointment.id,
            title: 'New Appointment Request',
            message: `You have a new appointment request from ${appointment.students.first_name} ${appointment.students.last_name}`,
            type: 'appointment_request',
          });

        // Send push notification if user has a push token
        if (advisorUser.users?.push_token) {
          await sendPushNotification(
            advisorUser.users.push_token,
            'New Appointment Request',
            `${appointment.students.first_name} ${appointment.students.last_name} requested an appointment`,
            {
              type: 'appointment_request',
              appointmentId: appointment.id,
            }
          );
        }
      }
    } catch (notifyError) {
      console.error("Notification failed (non-fatal):", notifyError);
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: {
        id: appointment.id,
        studentId: appointment.student_id,
        advisorId: appointment.advisor_id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        issueCategory: appointment.issue_category,
        issueDescription: appointment.issue_description,
        status: appointment.status,
        advisor: appointment.advisors ? {
          name: appointment.advisors.users ? `${appointment.advisors.users.first_name} ${appointment.advisors.users.last_name}` : 'Advisor',
          department: appointment.advisors.department,
        } : null,
        createdAt: appointment.created_at,
      },
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create appointment',
    });
  }
};

/**
 * Get appointments
 */
const getAppointments = async (req, res) => {
  try {
    const { uid } = req.user;
    const { status } = req.query;

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, role')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let query = supabase
      .from('appointments')
      .select(`
        *,
        advisors:advisor_id (
          id,
          department,
          designation,
          users:user_id (
            first_name,
            last_name,
            email
          )
        ),
        students:student_id (
          first_name,
          last_name,
          email
        )
      `);

    // Filter by role
    if (user.role === 'student') {
      query = query.eq('student_id', user.id);
    } else if (user.role === 'advisor') {
      const { data: advisor } = await supabase
        .from('advisors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (advisor) {
        query = query.eq('advisor_id', advisor.id);
      }
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status);
    }

    const { data: appointments, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get appointments',
      });
    }

    // Format response
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      studentId: apt.student_id,
      advisorId: apt.advisor_id,
      appointmentDate: apt.appointment_date,
      appointmentTime: apt.appointment_time,
      issueCategory: apt.issue_category,
      issueDescription: apt.issue_description,
      status: apt.status,
      advisor: apt.advisors ? {
        name: `${apt.advisors.users.first_name} ${apt.advisors.users.last_name}`,
        department: apt.advisors.department,
        email: apt.advisors.users.email,
      } : null,
      student: apt.students ? {
        name: `${apt.students.first_name} ${apt.students.last_name}`,
        email: apt.students.email,
      } : null,
      createdAt: apt.created_at,
    }));

    res.json({
      success: true,
      data: formattedAppointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get appointments',
    });
  }
};

/**
 * Get appointment by ID
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('firebase_uid', uid)
      .single();

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select(`
        *,
        advisors:advisor_id (
          id,
          department,
          designation,
          users:user_id (
            first_name,
            last_name,
            email
          )
        ),
        students:student_id (
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error || !appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if user has access to this appointment
    if (user.role === 'student' && appointment.student_id !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (user.role === 'advisor') {
      const { data: advisor } = await supabase
        .from('advisors')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (advisor && appointment.advisor_id !== advisor.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }
    }

    res.json({
      success: true,
      data: {
        id: appointment.id,
        studentId: appointment.student_id,
        advisorId: appointment.advisor_id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        issueCategory: appointment.issue_category,
        issueDescription: appointment.issue_description,
        status: appointment.status,
        student: appointment.students ? {
          name: `${appointment.students.first_name} ${appointment.students.last_name}`,
          email: appointment.students.email,
        } : null,
        advisor: appointment.advisors ? {
          name: `${appointment.advisors.users.first_name} ${appointment.advisors.users.last_name}`,
          department: appointment.advisors.department,
          email: appointment.advisors.users.email,
        } : null,
        createdAt: appointment.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get appointment',
    });
  }
};

/**
 * Approve appointment
 */
const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    // Get advisor
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      console.error('User lookup failed in approveAppointment:', userError);
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const { data: advisor, error: advisorError } = await supabase
      .from('advisors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (advisorError || !advisor) {
      console.error('Advisor lookup failed in approveAppointment:', advisorError);
      return res.status(404).json({
        success: false,
        message: 'Advisor profile not found. Please ensure your advisor profile is properly set up.',
      });
    }

    // Update appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'Accepted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('advisor_id', advisor.id)
      .select(`
        *,
        students:student_id (
          id,
          first_name,
          last_name
        )
      `)
      .single();

    if (error || !appointment) {
      return res.status(400).json({
        success: false,
        message: error?.message || 'Failed to approve appointment',
      });
    }

    // Create notification for student and send push
    try {
      // Get student's push token
      const { data: student } = await supabase
        .from('users')
        .select('push_token, email')
        .eq('id', appointment.student_id)
        .single();

      // Create in-app notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: appointment.student_id,
          appointment_id: appointment.id,
          title: 'Appointment Approved',
          message: `Your appointment has been approved`,
          type: 'appointment_approved',
        });

      if (notifError) {
        console.error('Failed to create notification:', notifError);
      } else {
        console.log('Notification created successfully for student:', appointment.student_id);
      }

      // Send push notification if student has a push token
      if (student?.push_token) {
        await sendPushNotification(
          student.push_token,
          'Appointment Approved ✅',
          `Your appointment request has been approved`,
          {
            type: 'appointment_approved',
            appointmentId: appointment.id,
          }
        );
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Appointment approved successfully',
      data: {
        id: appointment.id,
        status: appointment.status,
        updatedAt: appointment.updated_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve appointment',
    });
  }
};

/**
 * Reject appointment
 */
const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const { uid } = req.user;

    // Get advisor
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      console.error('User lookup failed in rejectAppointment:', userError);
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const { data: advisor, error: advisorError } = await supabase
      .from('advisors')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (advisorError || !advisor) {
      console.error('Advisor lookup failed in rejectAppointment:', advisorError);
      return res.status(404).json({
        success: false,
        message: 'Advisor profile not found. Please ensure your advisor profile is properly set up.',
      });
    }

    // Update appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'Rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('advisor_id', advisor.id)
      .select(`
        *,
        students:student_id (
          id,
          first_name,
          last_name
        )
      `)
      .single();

    if (error || !appointment) {
      return res.status(400).json({
        success: false,
        message: error?.message || 'Failed to reject appointment',
      });
    }

    // Create notification for student and send push
    try {
      // Get student's push token
      const { data: student } = await supabase
        .from('users')
        .select('push_token, email')
        .eq('id', appointment.student_id)
        .single();

      // Create in-app notification
      const { error: notifError } = await supabase
        .from('notifications')
        .insert({
          user_id: appointment.student_id,
          appointment_id: appointment.id,
          title: 'Appointment Rejected',
          message: reason || 'Your appointment has been rejected',
          type: 'appointment_rejected',
        });

      if (notifError) {
        console.error('Failed to create notification:', notifError);
      } else {
        console.log('Notification created successfully for student:', appointment.student_id);
      }

      // Send push notification if student has a push token
      if (student?.push_token) {
        await sendPushNotification(
          student.push_token,
          'Appointment Rejected ❌',
          reason || 'Your appointment request was not approved',
          {
            type: 'appointment_rejected',
            appointmentId: appointment.id,
          }
        );
      }
    } catch (notifError) {
      console.error('Error creating notification:', notifError);
    }

    res.json({
      success: true,
      message: 'Appointment rejected successfully',
      data: {
        id: appointment.id,
        status: appointment.status,
        updatedAt: appointment.updated_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject appointment',
    });
  }
};

/**
 * Complete appointment
 */
const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('firebase_uid', uid)
      .single();

    // Update appointment
    const { data: appointment, error } = await supabase
      .from('appointments')
      .update({
        status: 'Completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !appointment) {
      return res.status(400).json({
        success: false,
        message: error?.message || 'Failed to complete appointment',
      });
    }

    res.json({
      success: true,
      message: 'Appointment marked as completed',
      data: {
        id: appointment.id,
        status: appointment.status,
        updatedAt: appointment.updated_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete appointment',
    });
  }
};

/**
 * Cancel appointment
 */
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('firebase_uid', uid)
      .single();

    // Delete appointment (or update status to Cancelled)
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to cancel appointment',
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel appointment',
    });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  approveAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
};

