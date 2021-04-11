const Course = require('../models/course')
const User = require('../models/user')
const formidable = require('formidable')
const lodash = require('lodash')
const jwt = require('jsonwebtoken')




const create_course = async(req, res) => {


    try {
      const form = new formidable.IncomingForm()
      form.keepExtensions = true
      form.parse(req, (err, fields) => {

          if (err) {
              return res.status(400).json({ error: 'Could not add the course' })
          }
          const {user_id}=req.headers
          const user= User.findById(user_id)
          //check for empty fields
          const { courseCode, courseName, section, semester } = fields
          // if (!courseCode|| !courseName || !section || !semester ) {
          //     res.status(400).json({ error: 'All fields are required !' })
          // }
       const course=  Course.create({

          courseCode,
          courseName,
          section,
          semester,
          user:user.user_id

      })

       return res.json(course)

      })
    } catch (error) {
      res.status(400).json({message:error.toString ()})
   }

}



const list_courses = (req, res) => {

  Course.find()

    .populate('user')

    .exec((err, courses) => {

      if (err) {
        res.status(400).json({ error: 'You are not registered in this course yet' })
      }
      res.json(courses)

    })
}

const delete_course = (req, res) => {

  const course = req.course

  course.remove((err, deletedCourse) => {
    if (err) {
      return res.status(400).json({ error: 'Could not drop the course' })
    }
    res.json({
      'message': 'Course removed successfuly'
    })
  })

}
const courseById = (req, res, next, id) => {

  Course.findById(id).exec((err, course) => {
    if (err || !course) {
      return res.status(400).json({ error: 'course not found !' })
    }
    req.course = course
    next()
  })
}
const read = (req, res) => {

  return res.json(req.course)

}


const update = (req, res) => {

  const form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, (err, fields) => {


    const { courseCode, courseName, section, semester } = fields

    let course = req.course
    course = lodash.extend(course, fields)


    course.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: 'Could not perform this operation, something went wrong' })
      }
      return res.json(result)
    })
  })
}

const courses_by_student=(req, res)=>{

  Course.find({user:req.profile._id})
      .populate('user','_id name')
      .sort('_created')
      .exec((err, courses)=>{
          if (err){
              return res.status(400).json({error:'You are not enrolled'})
          }
          res.json(courses)
      })
}

const student_courses = (req, res) => {


  Course.find({})
    .populate('user', 'firstName lastName studentNumber')
    .exec((err, courses) => {
      if (err) {
        res.status(400).json({ error: 'No courses available for this student' })
      }
      else {
        res.status(200).json(courses)
      }
    })
}
module.exports = {
  create_course,
  list_courses,
  delete_course,
  read,
  courseById,
  update,
  student_courses,
  courses_by_student
}