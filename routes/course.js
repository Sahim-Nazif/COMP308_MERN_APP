const express = require('express')
const router=express.Router()
const {create_course, list_courses, delete_course,read,courseById,update,student_courses, courses_by_student}=require('../controllers/courseConroller')
const {userById}=require('../controllers/userController')
const verifyToken= require('../config/verifyToken')
const {isAuth}= require('../controllers/authController')



//router.post('/create', verifyToken, create_course)
router.post('/course/create', create_course )
router.get('/course/list', list_courses)
router.get('/course/bystudent/:userId', courses_by_student )
router.get('/:courseId', read)
router.delete('/course/delete/:courseId/:userId', delete_course)
router.put('/course/update/:courseId/:userId',update)
router.param('userId', userById)
router.param('courseId', courseById)


router.get('/courses/:courseId', student_courses);
module.exports=router