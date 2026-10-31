const User = require("../models/User");

const shapeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  profilePicture: user.profilePicture,
  address: user.address,
  phone: user.phone,
  gender: user.gender,
  dob: user.dob,
  role: user.role,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const listUsers = async (req, res) => {
  try {
    const viewerId = req.user.id;
    const viewer = await User.findById(viewerId);
    const users = await User.find({ _id: { $ne: viewerId } });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users: users.map(shapeUser),
        length: users.length,
      },
      viewer,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Could not fetch users" });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({ _id: userId });

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(409).json({
      success: false,
      message: error.message,
      userId,
    });
  }
};

const approveUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "User approved successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(409)
      .json({ success: false, message: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(409)
      .json({ success: false, message: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res
      .status(409)
      .json({ success: false, message: error.message });
  }
};

module.exports = {
  listUsers,
  getUser,
  approveUser,
  deactivateUser,
  removeUser,
};
