import asyncHander from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @dec     Auth user/set token
// @route   Post /api/users/auth
// @access  Public
const authUser = asyncHander(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else {
        res.status(401)
        throw new Error('Invalid credential')
    }
})

// @dec     Register new user
// @route   Post /api/users/
// @access  Public
const registerUser = asyncHander(async (req, res) => {
    
    const { name, email, password } = req.body
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error('User email exists.')
    }

    const user = await User.create({
        name, email, password
    })

    if(user){
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @dec     Logout user
// @route   Post /api/users/logout
// @access  Public
const logoutUser = asyncHander(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({messgae: 'User logged out'})
})

// @dec     Get user profile
// @route   Get /api/users/profile
// @access  Private
const getUserProfile = asyncHander(async (req, res) => {
    const user = {
        _id: req.user._id,
        email: req.user.email,
        name: req.user.email,
    }
    res.status(200).json(user)
})

// @dec     Update user profile
// @route   Put /api/users/profile
// @access  Private
const updateUserProfile = asyncHander(async (req, res) => {
    console.log(req.user)
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save()
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
}