import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Add user info to request object
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: "Authentication error" 
    });
  }
};

// Optional: Add more middleware functions for different auth scenarios
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Authorization error" 
    });
  }
};

// Rate limiting middleware
export const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

// Validate session middleware
export const validateSession = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.lastActive) {
      user.lastActive = new Date();
      await user.save();
    }
    
    // Update last active timestamp
    const now = new Date();
    const lastActive = new Date(user.lastActive);
    const hoursSinceLastActive = (now - lastActive) / (1000 * 60 * 60);

    // If more than 24 hours since last activity, require re-authentication
    if (hoursSinceLastActive > 24) {
      return res.status(401).json({ 
        success: false, 
        message: "Session expired. Please login again" 
      });
    }

    // Update last active timestamp
    user.lastActive = now;
    await user.save();

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Session validation error" 
    });
  }
};