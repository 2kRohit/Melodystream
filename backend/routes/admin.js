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
const Contact=require("../models/contact")
const Music=require("../models/music")
const fs = require('fs');

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

  router.get('/count',async(req,res)=>{
    try{
    usercount=await User.find({role:'user'})
    verifiedvideocount=await Video.find({status:'verified'})
    notverifiedvideocount=await Video.find({status:'unverified'})
    rejectedvideocount=await Video.find({status:'rejected'})
    verifiercount=await User.find({role:'verifier'})
    musiccount=await Music.find()
    video=await Video.find()
    contact=await Contact.find()
    report=await Report.find()
    res.status(200).json({ user:usercount.length,
      verifier:verifiercount.length,
      verifiedvideocount:verifiedvideocount.length,
      notverifiedvideocount:notverifiedvideocount.length,
      rejectedvideocount:rejectedvideocount.length,
      musiccount: musiccount.length,
      video:video.length,
      report:report.length,
      contact:contact.length
    });
    }
    catch (error) {
    
    }
  })
  router.get('/editmusic/:id',async(req,res)=>{
    try
    {
    const {id}=req.params
    const music=await Music.findById(id)
    res.status(200).json(music)
    }
    catch(error){
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  })
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/music');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage });
  
 
  router.post('/changemusic/:id', upload.fields([{ name: 'musicFile', maxCount: 1 }, { name: 'thumbnailFile', maxCount: 1 }]), async (req, res) => {
    try {
      const {id}=req.params
      const { title, description, tags, category,language,artist,mood } = req.body;
      const { musicFile, thumbnailFile } = req.files;
      const musicPath = musicFile? musicFile[0].path : null;
      const thumbnailPath = thumbnailFile ? thumbnailFile[0].path : null;
     const music= await Music.findById(id)
        music.title=title
        music.description=description
        music.mood=mood
        music.category=category
        music.language=language
        music.artist=artist
        if(musicPath){
          const musicFilePath = path.join(__dirname,'..', music.musicPath);
        fs.unlinkSync(musicFilePath);
music.musicPath=musicPath
        }
        if(thumbnailFile)
       {
        const thumbnailFilePath = path.join(__dirname,'..', music.thumbnailPath);
        fs.unlinkSync(thumbnailFilePath);   
music.thumbnailPath=thumbnailPath
       }

  
      await music.save();
  
      res.status(201).json({ message: 'Music updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  });

module.exports = router;