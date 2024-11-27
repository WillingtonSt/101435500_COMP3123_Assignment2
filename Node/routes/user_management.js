const userModel = require('../models/user_schema.js');
const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');


const router = express.Router();


router.post('/api/v1/user/signup', [

    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 chaaters long')

    ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const userWithUsername = await userModel.findOne({ username: username });

    if (userWithUsername) {
        return res.status(409).json({ message: 'username is taken'})
    }

    const userWithEmail = await userModel.findOne({ email: email });

    if (userWithEmail) {
        return res.status(409).json({ message: 'email is taken'})
    }

    const hashPassword = await bcrypt.hash(password, 10); //hash the password for added security

    const user = new userModel({
        username: req.body.username,
        email: req.body.email,
        password: hashPassword
    })

    user.save()
        .then(data => {
            res.status(201).send({
                message: `User registered successfully User ID: ${data._id}`,
                user: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});



router.post('/api/v1/user/login', [

    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
], async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'Email and password required'})
    }     

        const user = await userModel.findOne({email: email});

        if(!user) {
            return res.status(401).json({ message: 'User not found with email' });
        }

        const match = await bcrypt.compare(password, user.password)

        if(match) {
            return res.status(200).json({message: 'Login successful', userId: user._id})
        } else {
            return res.status(401).json({message: 'Invalid password'});
        }
    
});


module.exports = router;