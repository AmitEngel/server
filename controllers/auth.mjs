import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';
import { User } from '../models/user.js'
/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const onReload = async (req, res) => {
    try {
        const id = req.userData.userId;
        const user = await User.findById(id);
        res.status(201).send(user);
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

const createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                tz:req.body.tz,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                city: req.body.city,
                street: req.body.street,
            })
            user.save()
                .then(result => {
                    res.status(200).json({
                        message: "User added successfully!",
                        result: result
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        message: err
                    })
                })
        })
}

const userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                throw new Error('User Not Recognized!');
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        }).then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Invalid Credentials!"
                })
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" })
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                user:fetchedUser
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(401).json({
                message: err.toString()
            })
        })
}

export { createUser, userLogin, onReload }

