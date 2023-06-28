const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Music = require('../models/music.js');
const Musiccategory=require('../models/musicategory.js');
const Artist=require('../models/artist.js');
const Language=require('../models/language.js')
const Favourite=require('../models/favourite.js')
const Musichistory=require('../models/musichistory.js')
const Playlistname=require('../models/playlistname.js')
const Playlist=require('../models/playlist.js')
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
  
 
  router.post('/upload-music', upload.fields([{ name: 'musicFile', maxCount: 1 }, { name: 'thumbnailFile', maxCount: 1 }]), async (req, res) => {
    try {
      const { title, description, tags, category,language,artist } = req.body;
      const { musicFile, thumbnailFile } = req.files;
      const musicPath = musicFile[0].path;
      const thumbnailPath = thumbnailFile ? thumbnailFile[0].path : null;
     
      
  
      const newMusic = new Music({
        title,
        description,
        
        category,
        musicPath,
        thumbnailPath,
        language,
        artist
       
      });
  
      await newMusic.save();
  
      res.status(201).json({ message: 'Music uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  });

  router.post('/addmusiccategory', async (req, res) => {
    try {
      const { name } = req.body;
  
      // Create a new category
      const category = new Musiccategory({ name });
  
      // Save the category to the database
      await category.save();
  
      res.status(201).json(category);
    } catch (error) {
      console.error('Error inserting category:', error);
      res.status(500).json({ error: 'Failed to insert category' });
    }
  });


  router.get('/getcategory', async (req, res) => {
    try {
     
      const category = await Musiccategory.find();
        res.status(201).json(category);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.delete('/musiccategory/:id', async (req, res) => {
    try {
     const {id}=req.params
      const category = await Musiccategory.findByIdAndDelete({_id:id});
        res.status(201).json({ message: 'Deleted' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });

  router.post('/addartist', async (req, res) => {
    try {
      const { name } = req.body;
  
      const artist = new Artist({ name });
  await artist.save();
  
      res.status(201).json(artist);
    } catch (error) {
      console.error('Error inserting artist:', error);
      res.status(500).json({ error: 'Failed to insert artist' });
    }
  });
  router.get('/getartist', async (req, res) => {
    try {
     
      const artist = await Artist.find();
        res.status(201).json(artist);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.delete('/artist/:id', async (req, res) => {
    try {
     const {id}=req.params
      const artist = await Artist.findByIdAndDelete({_id:id});
        res.status(201).json({ message: 'Deleted' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });

  router.post('/addlanguage', async (req, res) => {
    try {
      const { name } = req.body;
  
      const language = new Language({ name });
  await language.save();
  
      res.status(201).json(language);
    } catch (error) {
      console.error('Error inserting language:', error);
      res.status(500).json({ error: 'Failed to insert language' });
    }
  });
  router.get('/getlanguage', async (req, res) => {
    try {
     
      const language = await Language.find();
        res.status(201).json(language);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.delete('/language/:id', async (req, res) => {
    try {
     const {id}=req.params
      const language = await Language.findByIdAndDelete({_id:id});
        res.status(201).json({ message: 'Deleted' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });

  router.get('/getmusic', async (req, res) => {
    try {
     
      const music = await Music.find();
        res.status(201).json(music);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.get('/getmusicbyid/:id', async (req, res) => {
    try {
     const {id}=req.params
      const music = await Music.findById({_id:id});
        res.status(201).json(music);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.get('/getmusicbycategory/:category/:id', async (req, res) => {
    try {
     const {id,category}=req.params
      const music = await Music.find({category, _id: { $ne: id }});
        res.status(201).json(music);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  router.delete('/deletemusic/:id', async (req, res) => {
    try {
     const {id}=req.params
      const music = await Music.findByIdAndDelete({_id:id});
      const favourite=await Favourite.deleteMany({musicId:id})
      const history=await Musichistory.deleteMany({musicId:id})
      const playlist=await Playlist.deleteMany({musicId:id})
        res.status(201).json({ message: 'Deleted' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred ' });
    }
  });
  //musichiistory
  router.put('/incrementviews/:musicId/:userId', async (req, res) => {
    try {
      const { musicId,userId } = req.params;
      const music = await Music.findById(musicId);
  
      if (!music) {
        return res.status(404).json({ message: 'Music not found' });
      }
  
      music.views += 1;
      await music.save();
      const history = await Musichistory.find({ musicId, userId });
  
      if (history.length !== 0) {
        await Musichistory.findOneAndDelete({ musicId, userId });
      } 
      const newHistory = new Musichistory({
        musicId,
        userId,
      });
      await newHistory.save();
      
      res.status(200).json({ message: 'View count added successfully and music saved to history' });
    } catch (error) {
      console.error('Error incrementing view count:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
//makefavourite
router.post('/:musicId/favourite/:userId', async (req, res) => {
  try {
    const { musicId, userId } = req.params;
    const favourite = await Favourite.find({ musicId, userId });

    if (favourite.length === 0) {
      const newFavourite = new Favourite({
        musicId,
        userId,
      });

      await newFavourite.save();
      res.status(201).json({ message: 'Music saved' });
    } else {
      await Favourite.findOneAndDelete({ musicId, userId });
      res.status(200).json({ message: 'Music deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving or deleting the Music' });
  }
});
router.get('/:musicId/favouritestatus/:userId', async (req, res) => {
  try {
    const { musicId, userId } = req.params;
    const favourite = await Favourite.find({ musicId, userId });
const status=true;
    if (favourite.length === 0) {
      res.status(201).json({status:false});
    } else {
      
      res.status(200).json({ status });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred on favourite' });
  }
});
//view favourite
router.get('/favourite/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const favourite = await Favourite.find({ userId })
      .populate({
        path: 'musicId',
        model: 'Music',
        select: { timestamp: 0 } // Exclude the timestamp field from the video model
      })
      .select('timestamp musicId')
      .exec();

    const processedData = favourite.map(item => ({
      ...item.musicId.toObject(), // Convert the populated videoId to a plain object
      timestamp: item.timestamp
    }));

    res.status(200).json(processedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching favourite' });
  }
});
 //musichistory
 router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await Musichistory.find({ userId })
      .populate({
        path: 'musicId',
        model: 'Music',
        // Exclude the timestamp field from the video model
      })  
      .select('timestamp musicId')
      .exec();

    const processedData = history.map(item => ({
      ...item.musicId.toObject(), // Convert the populated musicId to a plain object
      timestamp: item.timestamp
    }));

    res.status(200).json(processedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching history' });
  }
});
router.delete('/historydelete/:musicId/:userId', async (req, res) => {
  try {
    const { musicId, userId } = req.params;
    
      await Musichistory.findOneAndDelete({ musicId, userId });
      res.status(200).json({ message: 'History deleted successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while deleting the history' });
  }
});

router.delete('/clearhistory/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
      await Musichistory.deleteMany({ userId });
      res.status(200).json({ message: 'History deleted successfully' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while saving or deleting the history' });
  }
});

router.post('/addplaylist/:userId', async (req, res) => {
  try {
    const { name } = req.body;
    const {userId} =req.params
    const playlist = new Playlistname({ name,userId });

  
    await playlist.save();

    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error inserting playlist:', error);
    res.status(500).json({ error: 'Failed to insert playlist' });
  }
});

router.get('/getplaylist/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const playlist = await Playlistname.find({ userId })
  
    res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching playlist' });
  }
});


router.delete('/deleteplaylist/:playlistid/:playlistname/:userId', async (req, res) => {
  try {
   const {playlistid,playlistname,userId}=req.params
    const playlistna = await Playlistname.findByIdAndDelete({_id:playlistid});
    const playlist=await Playlist.deleteMany({name:playlistname,userId})
    if(playlistna && playlist){
      res.status(201).json({ message: 'Deleted' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred ' });
  }
});

router.post('/musictoplaylist/:userId', async (req, res) => {
  try {
    const { name,mid} = req.body;
    const {userId} =req.params
    const play=await Playlist.find({ name,userId,musicId:mid })
    if(play.length===0){
    const playlist = new Playlist({ name,userId,musicId:mid });
    await playlist.save();
    res.status(201).json(playlist);
  }

    res.status(204).json("already");
  } catch (error) {
    console.error('Error inserting playlist:', error);
    res.status(500).json({ error: 'Failed to insert playlist' });
  }
});

router.get('/getplaylistsong/:userId/:name', async (req, res) => {
  try {
    const { userId,name } = req.params;

    const playlist = await Playlist.find({ userId,name }).populate({
      path: 'musicId',
      model: 'Music',
      // Exclude the timestamp field from the video model
    })  
    .select('timestamp musicId')
    .exec();

  const processedData = playlist.map(item => ({
    ...item.musicId.toObject(), // Convert the populated musicId to a plain object
    timestamp: item.timestamp
  }));

  res.status(200).json(processedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching playlist' });
  }
});

router.delete('/deleteplaylistsong/:musicId/:playlistname/:userId', async (req, res) => {
  try {
   const {musicId,playlistname,userId}=req.params
    const playlistna = await Playlist.findOneAndDelete({musicId,userId,name:playlistname});
      res.status(201).json({ message: 'Deleted' });
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred ' });
  }
});


router.get('/searchmusic/:q', async (req, res) => {
  try {
    const {q} = req.params; 

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(q, 'i');

    const music = await Music.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { language: { $regex: regex } },
        { artist: { $regex: regex } },
      
        { category: { $regex: regex } },
      ],
    });

    res.status(200).json( music );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;