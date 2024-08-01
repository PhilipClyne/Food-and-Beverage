const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const bcrypt = require('bcryptjs');
const createToken = require('../utils/generateToken');

const createUser = async (req, res) => {
  const { username, email, password, phoneNumber } = req.body;

  if (!username || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, phoneNumber });
    await newUser.save();

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      phoneNumber: newUser.phoneNumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = createToken(user._id);
      console.log('Generated Token:', token);

      const savedToken = await new Token({ userId: user._id, token }).save();
      console.log('Saved Token:', savedToken);

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logoutCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (token) {
      const deletedToken = await Token.findOneAndDelete({ token });
      console.log('Deleted Token:', deletedToken);

      res.cookie('authToken', '', { maxAge: 1 });
      res.status(200).json({ message: 'Logged out successfully' });
    } else {
      res.status(401).json({ message: 'No token found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        phoneNumber: user.phoneNumber,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update non-password fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    // If currentPassword is provided, update the password
    if (req.body.currentPassword && req.body.newPassword) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect current password' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      phoneNumber: updatedUser.phoneNumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsersByRole = async (req, res) => {
  const { role } = req.query; // role is expected to be 'admin' or 'staff'

  let filter = {};
  if (role === 'admin') {
    filter.isAdmin = true;
  } else if (role === 'staff') {
    filter.isAdmin = false;
  }

  try {
    const users = await User.find(filter);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserOrderStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the pre-calculated order stats from the user document
    res.status(200).json({
      successfulOrders: user.successfulOrders,
      canceledOrders: user.canceledOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


module.exports = {
  createUser,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  getAllUsers,
  getUsersByRole,
  getUserOrderStats,
};
