const post = require("../models/post")
const User = require("../models/User")

const router = require("express").Router()

router.post("/",async (req,res) => {
    const newPost = new post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/:id",async (req,res) => {
    try {
        const post = await post.findById(req.params.id)
    if(post.userId === req.body.userId){
        await post.updateOne({$set : req.body})
        res.status(200).json("the post has been updated")
    }
    else{
        res.status(403).json("You can update only your post")
    }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.delete("/:id",async (req,res) => {
    try {
        const post = await post.findById(req.params.id)
    if(post.userId === req.body.userId){
        await post.deleteOne()
        res.status(200).json("the post has been deleted")
    }
    else{
        res.status(403).json("You can delete only your post")
    }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.put("/:id/like",async (req,res) => {
    try {
        const Post = await post.findById(req.params.id)
    if(!Post.likes.includes(req.body.userId)){
        await Post.updateOne({$push : {likes : req.body.userId}})
        res.status(200).json("the post has been liked")
    }
    else{
        await Post.updateOne({$pull : {likes : req.body.userId}})
        res.status(200).json("the post has been disliked")
    }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/:id",async (req,res) => {
    try {
        const post = await post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/timeline/:userId",async (req,res) => {
    try {
        const currentUser = await User.findById(req.params.userId)
        const userPosts = await post.find({userId : currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
               return post.find({userId : friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get("/profile/:username",async (req,res) => {
    try {
        const user = await User.findOne({username : req.params.username})
        const posts = await post.find({userId : user._id})
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router