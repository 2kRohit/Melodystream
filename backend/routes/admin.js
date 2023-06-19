const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require('../models/video');
const Category = require('../models/videocategory');
const Saved = require('../models/saved');
const History= require('../models/history');
const Report = require('../models/report');
const { isValidObjectId } = require("mongoose");
const User=require('../models/user')

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
     
      const video = await Video.find();
        res.status(201).json(video);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
module.exports = router;