const prisma = require('../utils/prisma');
const bcrypt = require('bcrypt');

/**
 * @function getUserByEmail
 * @description Fetches a user by their email.
 * @param {Object} req - The request object.
 * @param {string} req.params.email - The email of the user to fetch.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} An error occurred while fetching the user.
 */
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true, name: true, email: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

/**
 * @function getUserById
 * @description Fetches a user by their ID.
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The ID of the user to fetch.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} An error occurred while fetching the user.
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

/**
 * @function getAllUsers
 * @description Fetches all users.
 * @param {Object} req - The request object (not used).
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} An error occurred while fetching the users.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

/**
 * @function createUser
 * @description Creates a new user.
 * @param {Object} req - The request object.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} An error occurred while creating the user.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: { name, email, password_hash },
    });

    res.status(201).json({ id: newUser.id, name: newUser.name, email: newUser.email });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
};


/**
 * @function updateUser
 * @description Updates a user's information based on provided fields.
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {string} [req.body.name] - The new name of the user.
 * @param {string} [req.body.email] - The new email of the user.
 * @param {string} [req.body.password] - The new password of the user.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} An error occurred while updating the user.
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) {
    data.password_hash = await bcrypt.hash(password, 10);
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
};

/**
 * @function deleteUser
 * @description Deletes a user based on their ID.
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} An error occurred while deleting the user.
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};