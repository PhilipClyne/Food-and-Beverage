const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  loginUser,
  logoutCurrentUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  getUsersByRole,
  getUserOrderStats,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/accountMiddleware');


router
  .route("/")
  .get(protect, admin, getAllUsers);
router.post("/login", loginUser);
router.post("/logout", logoutCurrentUser);
router
  .route("/register")
  .post(createUser);

router
  .route("/profile")
  .get(protect, getCurrentUserProfile)
  .put(protect, updateCurrentUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUserById)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUserById);

router
  .route('/role')
  .get(protect, admin, getUsersByRole);
router
  .route('/:id/stats')
  .get(protect, admin, getUserOrderStats);

module.exports = router;
