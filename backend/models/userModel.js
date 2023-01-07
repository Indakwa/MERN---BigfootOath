const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    nickname: {
      type: String,
      required: [true, 'Please add a nickname'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    image: {
      type: String,
      required: [true, 'Please add your Picture'],
    },
    cloudinary_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
