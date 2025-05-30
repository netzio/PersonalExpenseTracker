const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');

/**
 * @route GET /email/:email
 * @description Fetch a user by email.
 * @access Public
 * @param {string} req.params.email - Email of the user
 * @returns {Object} User object
 */
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

/**
 * @route GET /id/:id
 * @description Fetch a user by ID.
 * @access Public
 * @param {number} req.params.id - ID of the user
 * @returns {Object} User object
 */
router.get('/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

/**
 * @route GET /all
 * @description Fetch all users from the database.
 * @access Public
 * @returns {Array<Object>} List of users
 */
router.get('/all', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * @route POST /
 * @description Create a new user with the provided name, email, and password.
 * @access Public
 * @param {string} req.body.name - Name of the user
 * @param {string} req.body.email - Email of the user
 * @param {string} req.body.password - Password of the user
 * @returns {Object} Newly created user with id, name, and email
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password_hash,
      },
    });
    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint failed
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

/**
 * @route PUT /:id
 * @description Update a user's name, email, or password by ID.
 * @access Public
 * @param {number} req.params.id - User ID
 * @param {string} [req.body.name] - New name
 * @param {string} [req.body.email] - New email
 * @param {string} [req.body.password] - New password
 * @returns {Object} Updated user
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) {
    const saltRounds = 10;
    data.password_hash = await bcrypt.hash(password, saltRounds);
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update.' });
  }

  try {
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data,
      select: { id: true, name: true, email: true }
    });
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

module.exports = router;
