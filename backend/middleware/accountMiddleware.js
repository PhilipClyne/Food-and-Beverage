const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');

const protect = async (req, res, next) => {
  let token;

  if (req.cookies.authToken) {
    try {
      token = req.cookies.authToken;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userToken = await Token.findOne({ token });

      if (!userToken) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
