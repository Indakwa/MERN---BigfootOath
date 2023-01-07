const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const fs = require('fs');
const cloudinary = require('../utils/cloudinary')


// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {

  try {
    const { nickname, email, password } = req.body

    if (!nickname || !email || !password) {
      throw new Error('Please add all fields')
    }
  
    if(!req.file){
      throw new Error('Please upload your favorite picture')
    }
  
    // Check if user exists
    const userExists = await User.findOne({ nickname })
    const emailExists = await User.findOne({ email })
  
    if (userExists) {
      throw new Error('Nickname already exists')
    }
    if (emailExists) {
      throw new Error('A friend already registered with this email. Please use another email')
    }
  
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
  
    // Create user
    const { path } = req.file
    const result = await cloudinary.uploader.upload(path)
    const user = new User({
        nickname: req.body.nickname,
        email: req.body.email,
        password: hashedPassword,
        image: result.secure_url,
        cloudinary_id: result.public_id,
    })
    await user.save()
    fs.unlinkSync(path)
  
    if (user) {
      res.status(201).json({
        _id: user.id,
        nickname: user.nickname,
        email: user.email,
        image: user.image,
        cloudinary_id: user.cloudinary_id,
        token: generateToken(user._id),
      })
    } else {
      throw new Error('Invalid user data')
    }
  } catch (error) {
    res.send(`${error.message}`);
  }

})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {

  try {
    const { nickname, password } = req.body

    // Check for user nickname
    const user = await User.findOne({ nickname })
  
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(201).json({
          _id: user.id,
          nickname: user.nickname,
          email: user.email,
          image: user.image,
          cloudinary_id: user.cloudinary_id,
          token: generateToken(user._id),
      })
    } else {
      throw new Error('Invalid credentials')
    }
  } catch (error) {
     res.send(`${error.message}`);
  }

})


// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc    Get user data
// @route   GET /api/users/all
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find().select('nickname image').lean().exec();
  res.status(200).json(allUsers);
})



// @desc    update user data
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.params.id).exec();

    // Set result to null if req.file is not defined
    let result = req.file ? await cloudinary.uploader.upload(req.file.path) : null;

    // Use existing image and cloudinary_id if result is null
    const data = {
      nickname: req.body.nickname || user.nickname,
      image: result ? result.secure_url : user.image,
      cloudinary_id: result ? result.public_id : user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
    // Delete the uploaded file if result is not null
    if (result) fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(error);
  }
});


// @desc    delete user data
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    try {
        // get the user by Id
        const user = await User.findById(req.params.id);
        // delete the the picture from cloudinary using the cloudinary_id      
        await cloudinary.uploader.destroy(user.cloudinary_id);
        // remove the user from the database
        await user.remove()
        res.status(204).json(user)
        //console.log(`${user.nickname} has   been deleted successfully!`)
    }catch (error) {
        console.log(error);
    }
})




// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
}
