const express=require('express')
const router=express.Router();
const {userById, read, update,   list_users}= require('../controllers/userController')
const {isAuth,isAdmin}=require('../controllers/authController')





router.get('/secret/:userId',  isAuth,(req, res)=>{
    res.json({
        user:req.profile
    })
})
router.get('/user/students',   list_users)
router.get('/user/:userId',isAdmin, read)
router.put('/user/:userId',  update)
router.param('userId', userById)


module.exports=router;