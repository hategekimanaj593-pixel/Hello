const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').notEmpty().trim(),
    body('lastName').notEmpty().trim(),
    body('role').isIn(['admin', 'doctor', 'nurse', 'receptionist', 'auditor']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { email, password, firstName, lastName, role, department } = req.body;

    try {
      const connection = await pool.getConnection();

      // Check if user already exists
      const [existingUser] = await connection.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        connection.release();
        return res.status(409).json({
          success: false,
          status: 409,
          message: 'Email already registered',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await connection.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role, department, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, role, department || null, 'active']
      );

      connection.release();

      // Generate token
      const token = jwt.sign(
        {
          userId: result.insertId,
          email: email,
          role: role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.status(201).json({
        success: true,
        status: 201,
        message: 'User registered successfully',
        data: {
          userId: result.insertId,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: role,
          token: token,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Server error during registration',
      });
    }
  }
);

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      const connection = await pool.getConnection();

      // Find user
      const [users] = await connection.query(
        'SELECT id, email, password_hash, first_name, last_name, role, department, status FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        connection.release();
        return res.status(401).json({
          success: false,
          status: 401,
          message: 'Invalid email or password',
        });
      }

      const user = users[0];

      // Check if user is active
      if (user.status !== 'active') {
        connection.release();
        return res.status(403).json({
          success: false,
          status: 403,
          message: 'User account is inactive',
        });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        connection.release();
        return res.status(401).json({
          success: false,
          status: 401,
          message: 'Invalid email or password',
        });
      }

      connection.release();

      // Generate token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || '24h' }
      );

      res.json({
        success: true,
        status: 200,
        message: 'Login successful',
        data: {
          token: token,
          user: {
            userId: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            department: user.department,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        status: 500,
        message: 'Server error during login',
      });
    }
  }
);

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    status: 200,
    message: 'Logout successful',
  });
});

/**
 * POST /api/v1/auth/refresh-token
 * Refresh JWT token
 */
router.post('/refresh-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      status: 401,
      message: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    res.json({
      success: true,
      status: 200,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      status: 401,
      message: 'Invalid token',
    });
  }
});

module.exports = router;
