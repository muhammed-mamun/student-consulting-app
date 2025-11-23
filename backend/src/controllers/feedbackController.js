const supabase = require('../config/supabase');

/**
 * Submit feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const { uid } = req.user;
    const { appointmentId, rating, comment } = req.body;

    // Get student user ID
    const { data: student, error: studentError } = await supabase
      .from('users')
      .select('id')
      .eq('firebase_uid', uid)
      .single();

    if (studentError || !student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Get appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('advisor_id, student_id')
      .eq('id', appointmentId)
      .eq('student_id', student.id)
      .single();

    if (appointmentError || !appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    // Check if feedback already exists
    const { data: existingFeedback } = await supabase
      .from('feedback')
      .select('id')
      .eq('appointment_id', appointmentId)
      .single();

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already submitted for this appointment',
      });
    }

    // Create feedback
    const { data: feedback, error } = await supabase
      .from('feedback')
      .insert({
        appointment_id: appointmentId,
        student_id: student.id,
        advisor_id: appointment.advisor_id,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to submit feedback',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: {
        id: feedback.id,
        appointmentId: feedback.appointment_id,
        studentId: feedback.student_id,
        advisorId: feedback.advisor_id,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: feedback.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit feedback',
    });
  }
};

/**
 * Get feedback by appointment
 */
const getFeedbackByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const { data: feedback, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('appointment_id', appointmentId)
      .single();

    if (error || !feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: feedback.id,
        appointmentId: feedback.appointment_id,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: feedback.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get feedback',
    });
  }
};

/**
 * Get feedback by advisor
 */
const getFeedbackByAdvisor = async (req, res) => {
  try {
    const { advisorId } = req.params;

    const { data: feedbackList, error } = await supabase
      .from('feedback')
      .select(`
        *,
        students:student_id (
          first_name,
          last_name
        )
      `)
      .eq('advisor_id', advisorId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get feedback',
      });
    }

    // Calculate average rating
    const ratings = feedbackList.map(f => f.rating);
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    res.json({
      success: true,
      data: feedbackList.map(feedback => ({
        id: feedback.id,
        appointmentId: feedback.appointment_id,
        rating: feedback.rating,
        comment: feedback.comment,
        student: feedback.students ? {
          name: `${feedback.students.first_name} ${feedback.students.last_name}`,
        } : null,
        createdAt: feedback.created_at,
      })),
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: feedbackList.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get feedback',
    });
  }
};

module.exports = {
  submitFeedback,
  getFeedbackByAppointment,
  getFeedbackByAdvisor,
};

