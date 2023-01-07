const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/multer')


router.post('/', upload.single('image'), registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.get('/all', getAllUsers)
router.put('/:id', upload.single('image'), protect, updateUser)
router.delete('/:id', protect, deleteUser)



module.exports = router
