const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;

    if (!username || !password || !full_name || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['admin', 'security'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or security' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, full_name, role });
    const userData = user.toJSON();
    delete userData.password;
    res.status(201).json(userData);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent modifying the primary admin username/role if it's the only admin
    const { full_name, role, is_active, password } = req.body;

    if (role !== undefined && !['admin', 'security'].includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or security' });
    }

    // Prevent deactivating or changing role of last active admin
    if ((is_active === false || role === 'security') && user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin', is_active: true } });
      if (adminCount <= 1) {
        return res.status(403).json({ message: 'Cannot deactivate or downgrade the last active admin' });
      }
    }

    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (role !== undefined) updates.role = role;
    if (is_active !== undefined) updates.is_active = is_active;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    await user.update(updates);
    const userData = user.toJSON();
    delete userData.password;
    res.json(userData);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deleting self
    if (user.id === req.user.id) {
      return res.status(403).json({ message: 'Cannot delete your own account' });
    }

    // Prevent deleting last admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin', is_active: true } });
      if (adminCount <= 1) {
        return res.status(403).json({ message: 'Cannot delete the last admin account' });
      }
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
