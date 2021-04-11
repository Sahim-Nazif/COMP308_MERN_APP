const express = require('express');
const app = express()
const dotenv=require('dotenv')
const morgan=require('morgan');
const mongoose=require('mongoose');
const expressValidator=require('express-validator')
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
// const categoryRoutes=require('./routes/category')
const courseRoutes=require('./routes/course')
const BodyParser=require('body-parser')
 const cookieParser=require('cookie-parser')
const cors=require('cors')





//middlewares

dotenv.config();



if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
    console.log('the app is in development phase')

} else if (process.env.NODE_ENV==='production') {

    app.use(compress());
    console.log('the app is in production phase ')
}

//db connection
mongoose
    .connect(process.env.MONGO_URI,{
        useNewUrlParser:true, 
        useUnifiedTopology:true,
        useCreateIndex: true, 
      
        })
        .then(()=> console.log('Mongo-DB Connected...'))
        .catch(err => console.log(err));
//static file access point
app.use(express.static('public/css'));

app.use(expressValidator())
app.use(express.json())
app.use(BodyParser.json())
app.use(cookieParser())
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.use('/', courseRoutes)
app.use('/',authRoutes)
app.use('/',userRoutes)


const PORT= process.env.PORT || 8000;

app.listen(PORT , ()=>{

    console.log(`The app is running in ${process.env.NODE_ENV} mode on port ${PORT }`)

})