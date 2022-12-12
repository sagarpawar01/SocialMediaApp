const Conversation = require("../models/Conversation")
const router = require("express").Router()

router.post("/",async(req,res) => {
    const newConversation = new Conversation({
        members : [req.body.senderId,req.body.receiverId]
    })
    try {
        const savedConversation = await newConversation.save()
        res.status(200).send(savedConversation)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/:userId",async(req,res) => {
    try {
        const conversation = await Conversation.find({
            members : { $in : [req.params.userId]}
        })
        res.status(200).send(conversation)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("find/:firstUserId/:secondUserId",async(req,res) => {
    try {
        const conversation = await Conversation.find({
            members : { $in : [req.params.firstUserId,req.params.secondUserId]}
        })
        res.status(200).send(conversation)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router