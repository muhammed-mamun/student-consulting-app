const admin = require('../config/firebase');
const supabase = require('../config/supabase');
const { generateToken } = require('../utils/jwt');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    // 1. Get the firebase_uid sent from the frontend
    // Note: We allow 'password' in the body so validation doesn't fail, but we don't use it here.
    const { email, firstName, lastName, role, phoneNumber, firebase_uid } = req.body;

    // Check if UID exists (Critical for the fix)
    if (!firebase_uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing Firebase UID. Frontend must authenticate first.' 
      });
    }

    // REMOVED: const userRecord = await admin.auth().createUser(...)
    // logic: The user already exists in Firebase (created by the app).

    // 2. Create user in Supabase directly
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        firebase_uid: firebase_uid, // <--- Using the ID from the frontend
        email,
        role,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || null,
      })
      .select()
      .single();

    if (error) {
      // Note: We do not delete the Firebase user here anymore. 
      // If this fails, the frontend handles the cleanup or shows an error.
      throw error;
    }

    // 3. Generate JWT token
    const token = generateToken({
      id: user.id,
      uid: firebase_uid,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error); // Helpful for debugging
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Firebase handles authentication on the client side.
    // This endpoint verifies the user exists in Supabase and issues a JWT for our API.
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials (User not found in database)',
      });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      uid: user.firebase_uid,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

/**
 * Get current user
 */
const getMe = async (req, res) => {
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
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user',
    });
  }
};

/**
 * Refresh token
 */
const refreshToken = async (req, res) => {
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

    // Generate new JWT token
    const token = generateToken({
      id: user.id,
      uid: user.firebase_uid,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to refresh token',
    });
  }
};

/**
 * Logout user
 */
const logout = async (req, res) => {
  try {
    // In a real app, you might want to invalidate the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  refreshToken,
  logout,
};