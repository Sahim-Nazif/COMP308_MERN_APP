const express=require('express')
const router=express.Router()
const {signup, sign_in, user_signout}=require('../controllers/authController')
const {userSignupValidator}=require('../validator/index')



router.post('/signup', userSignupValidator,  signup)
router.post('/signin',   sign_in)
router.get('/signout',  user_signout)





module.exports = router