const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/video');
const Category = require('../models/videocategory');
const Saved = require('../models/saved');
const History= require('../models/history');
const Report = require('../models/report');
const Musichistory=require("../models/musichistory")
const Playlist=require("../models/playlist")



const { isValidObjectId } = require("mongoose");
const User=require('../models/user');
const Favourite = require("../models/favourite");

router.get('/user', async (req, res) => {
    try {
     
      const user = await User.find({ role:"user",isVerified:true });
        res.status(201).json(user);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.get('/verifier', async (req, res) => {
    try {
     
      const user = await User.find({ role:"verifier",isVerified:true });
        res.status(201).json(user);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.get('/category', async (req, res) => {
    try {
     
      const category = await Category.find();
        res.status(201).json(category);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.delete('/category/:id', async (req, res) => {
    try {
     const {id}=req.params
      const category = await Category.findByIdAndDelete({_id:id});
        res.status(201).json({ message: 'Deleted' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });

  router.get('/videos', async (req, res) => {
    try {
      const videos = await Video.find({})
        .populate({
          path: 'userId', // Use 'userId' instead of '_id' to populate the user details
          model: 'User',
          select: 'profilePicture name' // Only select the 'profilePicture' field from the User model
        })
        .exec();
  
      const processedData = videos.map(video => ({
        ...video.toObject(), // Convert the video to a plain object
        user: video.userId.toObject()
      }));
  
      res.json(processedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  


  router.delete('/user/:id', async (req, res) => {
    try {
     const {id}=req.params
      const user = await User.findByIdAndDelete({_id:id});
      await Favourite.deleteMany({userId:id})
      await History.deleteMany({userId:id})
      await Musichistory.deleteMany({userId:id})
      await Playlist.deleteMany({userId:id})
      await Report.deleteMany({userId:id})
      await Saved.deleteMany({userId:id})
      await Video.deleteMany({userId:id})
        res.status(201).json({ message: 'Deleted' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });


  router.post('/:userid/changepassword',async(req,res)=>{
    try{
const {currentPassword,newPassword}=req.body
const {userid}=req.params
const user=await User.findOne({_id:userid})
if (!user) return res.json('invalid user')

  const matched = await user.comparePassword(currentPassword);
  if (!matched) return res.json("Current Password mismatch!");
  if (matched){
    user.password=newPassword;
    const resp=await user.save()
    if(resp) return res.json("Password Changed")
    return res.json('Password not changed')

  }

    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  })
module.exports = router;