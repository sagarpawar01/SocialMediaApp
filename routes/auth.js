const User = require("../models/User")
// const bcrypt = require("bcrypt")

const router = require("express").Router()

router.post("/register",async (req,res) => {
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    })

    try {
        const user = await newUser.save()
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/login",async (req,res) => {
    try {
        const user = await User.findOne({email : req.body.email})
        !user && res.status(404).json("User not found")
        const password = await User.findOne({password : req.body.password})
        !password && res.status(404).json("Wrong password")
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

module.exports = router