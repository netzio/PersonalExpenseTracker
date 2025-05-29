const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.json({ message: 'User route works!' });
});

router.get('/all', async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

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

module.exports = router;
