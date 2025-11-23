const supabase = require('../config/supabase');

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const { uid } = req.user;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('firebase_uid', uid)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get profile',
    });
  }
};

/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const { firstName, lastName, phoneNumber } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        updated_at: new Date().toISOString(),
      })
      .eq('firebase_uid', uid)
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
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phoneNumber: user.phone_number,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

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

module.exports = {
  getProfile,
  updateProfile,
  getAdvisors,
};

