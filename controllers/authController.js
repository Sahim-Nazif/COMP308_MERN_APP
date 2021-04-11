const User = require('../models/user')
const { errorHandler } = require('../helpers/dbErrorsHandler')
const jwt = require('jsonwebtoken')//will be used to generated signed token
const expressJwt = require('express-jwt')


const signup = (req, res) => {

   const user = new User(req.body);
   user.save((err, user) => {

      if (err) {

         return res.status(400).json({ err: errorHandler(err) })
      }
      user.salt = undefined
      user.hashed_password = undefined

      res.json({ user })

   })
}

//student or user sign in 
const sign_in = (req, res) => {

   //find user by email
   const { email, password } = req.body;

   User.findOne({ email }, (err, user) => {


      if (err || !user) {

         return res.status(400).json({error:'Opps! Something went wrong. Please try again.' })
      }

      // if user is not found make sure the email and password
      else if (!user.authenticate(password)) {
         return res.status(401).json({ error: 'Email and password do not match!' })
      }
      //generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
      // persist the token as 't' in cookie with expirty
      res.cookie('t', token, { expire: new Date() + 9999 })

      //return response with user and token to front-end client
      const { _id, email, firstName, lastName, address,city, program,studentNumber, phoneNumber, role } = user

      return res.json({ token, user: { _id, email, firstName, lastName, address,city, program,studentNumber, phoneNumber, role } })

   })
}


//user logout

const user_signout=(req, res)=>{

   res.clearCookie('t')
   res.json({message:'You are logged out '})
}

const isAuth=(req, res, next)=>{

   try {
       const user=req.profile && req. auth && req.profile._id== req.auth._id
       if (!user){
        
           return res.status(403).json({error:'Access denied'})
       
       }
     
   } catch (error) {
       res.status(400).json({message:error})
   }
  
  // res.json(user)
  next()
   
}


const isAdmin=(req, res, next)=>{

   if (!req.profile.role===0) {
       return res.status(403).json({error:'Admin resource! Access denied'})
   }
   next();
}


module.exports = {

   signup,
   sign_in,
   user_signout,
   isAuth,
   isAdmin,
}