const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/video');
const Category = require('../models/videocategory');
const Saved = require('../models/saved');
const History= require('../models/history');
const Report = require('../models/report');
const User=require('../models/user');
const Contact=require('../models/contact')
const { isValidObjectId } = require("mongoose");
const { generateMailTransporter } = require("../utils/mail");

router.get('/unverifiedvideos', async (req, res) => {
    try {
      const videos = await Video.find({ status: "unverified" })
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
  

  router.get('/verifiedvideos', async (req, res) => {
    try {
      const videos = await Video.find({ status: "verified" })
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
  router.get('/rejectedvideos', async (req, res) => {
    try {
      const videos = await Video.find({ status: "rejected" })
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
  
  router.patch('/reject/:videoId', async (req, res) => {
    try {
      const { videoId } = req.params;
      const { reason } = req.body;
  
      // Find the video by its ID
      const video = await Video.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Update the visibility of the video
      video.reason= reason;
      video.status="rejected";
      await video.save();
  
      return res.status(200).json({ message: 'reason added successfully', video });
    } catch (error) {
      console.error('Error changing :', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.patch('/verify/:videoId', async (req, res) => {
    try {
      const { videoId } = req.params;
      const { reason } = req.body;
  
      // Find the video by its ID
      const video = await Video.findById(videoId);
  
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Update the visibility of the video
      video.reason= null;
      video.status="verified";
      await video.save();
  
      return res.status(200).json({ message: ' successfully', video });
    } catch (error) {
      console.error('Error changing :', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/verifiedreports', async (req, res) => {
    try {
      const reports = await Report.find({status:"verified"})
        .populate({
          path: 'videoId',
          model: 'Video',
        })
        .populate({
          path: 'userId',
          model: 'User',
        })
        .exec();
  
      const processedData = reports.map(report => ({
        ...report.toObject(),
        video: report.videoId.toObject(),
        user: report.userId.toObject()
      }));
  
      res.json(processedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  
  router.get('/unverifiedreports', async (req, res) => {
    try {
      const reports = await Report.find({status:"unverified"})
        .populate({
          path: 'videoId',
          model: 'Video',
        })
        .populate({
          path: 'userId',
          model: 'User',
        })
        .exec();
  
      const processedData = reports.map(report => ({
        ...report.toObject(),
        video: report.videoId.toObject(),
        user: report.userId.toObject()
      }));
  
      res.json(processedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  router.get('/reports/:videoId', async (req, res) => {
    try {
        const {videoId}=req.params
      const reports = await Report.find({videoId})
        .populate({
          path: 'videoId',
          model: 'Video',
        })
        .populate({
          path: 'userId',
          model: 'User',
        })
        .exec();
  
      const processedData = reports.map(report => ({
        ...report.toObject(),
        video: report.videoId.toObject(),
        user: report.userId.toObject()
      }));
  
      res.json(processedData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });

  router.patch('/verifyreports/:videoId/:userId', async (req, res) => {
    try {
      const { videoId,userId} = req.params;
     
  
      // Find the video by its ID
      const report = await Report.findOne({videoId,userId});
  
      // Update the visibility of the video
      
      report.status="verified";
      await report.save();
  
      return res.status(200).json({ message: ' successfully' });
    } catch (error) {
      console.error('Error changing :', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  router.get('/userprofilevideo/:userId', async (req, res) => {
    try {
        const {userId}=req.params
      const video = await Video.find({userId,status:"verified",visibility:"public"}).sort({ timestamp: -1 });
      res.json(video);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  router.get('/userprofile/:userId', async (req, res) => {
    try {
        const {userId}=req.params
      const user = await User.findOne({_id:userId})
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  router.post('/contact',async(req,res)=>{
    try{
const{name,email,description}=req.body
const status='not verified'
const resp=new Contact({name,email,description,status})
await resp.save()
res.json("done");
    }catch (error) {
      console.error(error);
      res.status(500).json({ message: "error occured" });
    }
  });
  router.get('/unverifiedcontact', async (req, res) => {
    try {
   
      const user = await Contact.find({status:'not verified'})
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  router.get('/verifiedcontact', async (req, res) => {
    try {
   
      const user = await Contact.find({status:'verified'})
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  router.post('/verifycontact/:_id/:reply', async (req, res) => {
    try {
      const { _id, reply } = req.params;
      const contact = await Contact.findById(_id);
      if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
  
      contact.status = 'verified';
      contact.reply = reply;
      await contact.save();
  
      const transport = generateMailTransporter();
      await transport.sendMail({
        from: 'verifier@melodystream.com',
        to: contact.email, // Assuming `user` is a typo and you meant `contact.email`
        subject: 'Reply for your message',
        html: `
          <h1>MELODYSTREAM</h1>
          <p>${reply}</p>
        `,
      });
  
      res.json(contact);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  });
  
module.exports = router;