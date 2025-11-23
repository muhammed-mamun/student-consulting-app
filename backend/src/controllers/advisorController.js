const supabase = require('../config/supabase');

/**
 * Get all advisors
 */
const getAdvisors = async (req, res) => {
  try {
    const { data: advisors, error } = await supabase
      .from('advisors')
      .select(`
        *,
        users:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get advisors',
      });
    }

    // Format response
    const formattedAdvisors = advisors.map(advisor => ({
      id: advisor.id,
      userId: advisor.user_id,
      department: advisor.department,
      designation: advisor.designation,
      consultationHoursStart: advisor.consultation_hours_start,
      consultationHoursEnd: advisor.consultation_hours_end,
      availableDays: advisor.available_days,
      bio: advisor.bio,
      user: advisor.users ? {
        firstName: advisor.users.first_name,
        lastName: advisor.users.last_name,
        email: advisor.users.email,
      } : null,
    }));

    res.json({
      success: true,
      data: formattedAdvisors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get advisors',
    });
  }
};

/**
 * Get advisor by ID
 */
const getAdvisorById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: advisor, error } = await supabase
      .from('advisors')
      .select(`
        *,
        users:user_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error || !advisor) {
      return res.status(404).json({
        success: false,
        message: 'Advisor not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: advisor.id,
        userId: advisor.user_id,
        department: advisor.department,
        designation: advisor.designation,
        consultationHoursStart: advisor.consultation_hours_start,
        consultationHoursEnd: advisor.consultation_hours_end,
        availableDays: advisor.available_days,
        bio: advisor.bio,
        user: advisor.users ? {
          firstName: advisor.users.first_name,
          lastName: advisor.users.last_name,
          email: advisor.users.email,
        } : null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get advisor',
    });
  }
};

/**
 * Get advisor availability
 */
const getAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    // Get advisor
    const { data: advisor, error: advisorError } = await supabase
      .from('advisors')
      .select('*')
      .eq('id', id)
      .single();

    if (advisorError || !advisor) {
      return res.status(404).json({
        success: false,
        message: 'Advisor not found',
      });
    }

    // Get booked appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('appointment_date, appointment_time, status')
      .eq('advisor_id', id)
      .eq('status', 'Accepted')
      .gte('appointment_date', startDate || new Date().toISOString().split('T')[0])
      .lte('appointment_date', endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (appointmentsError) {
      return res.status(400).json({
        success: false,
        message: appointmentsError.message || 'Failed to get availability',
      });
    }

    // Format booked slots
    const bookedSlots = appointments.map(apt => ({
      date: apt.appointment_date,
      time: apt.appointment_time,
    }));

    res.json({
      success: true,
      data: {
        advisorId: parseInt(id),
        availableDays: advisor.available_days ? advisor.available_days.split(',') : [],
        consultationHours: {
          start: advisor.consultation_hours_start,
          end: advisor.consultation_hours_end,
        },
        bookedSlots,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get availability',
    });
  }
};

/**
 * Update advisor profile
 */
const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const { department, designation, consultationHoursStart, consultationHoursEnd, availableDays, bio } = req.body;

    // Get user ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (userError || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update advisor profile
    const { data: advisor, error } = await supabase
      .from('advisors')
      .update({
        department,
        designation,
        consultation_hours_start: consultationHoursStart,
        consultation_hours_end: consultationHoursEnd,
        available_days: availableDays,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile',
      });
    }

    res.json({
      success: true,
      message: 'Advisor profile updated successfully',
      data: {
        id: advisor.id,
        department: advisor.department,
        designation: advisor.designation,
        consultationHoursStart: advisor.consultation_hours_start,
        consultationHoursEnd: advisor.consultation_hours_end,
        availableDays: advisor.available_days,
        bio: advisor.bio,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

module.exports = {
  getAdvisors,
  getAdvisorById,
  getAvailability,
  updateProfile,
};

