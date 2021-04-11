const User=require('../models/user')



const userById=(req, res,next, id)=>{

    User.findById(id).exec((err, user)=>{

        try {
            if(err || !user) {
                return res.status(400).json({error:'User not found'})
            }
        } catch (error) {
            res.status(400).json({error})
        }
    

        req.profile=user
        next()
    })


}

//get user
const read=(req, res)=>{

    req.profile.hashed_password=undefined
    req.profile.salt=undefined
    return  res.json(req.profile)
}


//update user profile

const update = (req, res) => {
    console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { email, firstName, lastName, address,city, program,studentNumber, phoneNumber, role,password  } = req.body;

    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (!firstName) {
            return res.status(400).json({
                error: 'Name is required'
            });
        } else {
            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;
            user.city = city;
            user.program=program;
            user.phoneNumber=phoneNumber;
        }

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: 'Password should be min 6 characters long'
                });
            } else {
                user.password = password;
            }
        }

        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'User update failed'
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });


};

const list_users=async(req, res)=>{

    await User.find().exec((err, users)=>{         
     
         if (err){
            res.status(400).json({error:'No students are enrolled yet '})
        }
        res.json(users)

    })
}



module.exports={

    userById,
    read,
    update,
    list_users

}


