const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let userRole = role;
    if (email.endsWith('sliit.lk') || email.endsWith('sllit.lk')) {
      userRole = 'student';
    } else if (email.endsWith('@gmail.com')) {
      userRole = 'lecturer';
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role: userRole });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name, email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    let roleUpdated = false;
    if ((email.endsWith('sliit.lk') || email.endsWith('sllit.lk')) && user.role !== 'student') {
      user.role = 'student';
      roleUpdated = true;
    } else if (email.endsWith('@gmail.com') && user.role !== 'lecturer') {
      user.role = 'lecturer';
      roleUpdated = true;
    }
    if (roleUpdated) {
      await user.save();
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let roleUpdated = false;
    if ((user.email.endsWith('sliit.lk') || user.email.endsWith('sllit.lk')) && user.role !== 'student') {
      user.role = 'student';
      roleUpdated = true;
    } else if (user.email.endsWith('@gmail.com') && user.role !== 'lecturer') {
      user.role = 'lecturer';
      roleUpdated = true;
    }
    if (roleUpdated) {
      await user.save();
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
