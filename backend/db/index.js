const mongoose=require('mongoose')
mongoose.connect(process.env.MONGOURI).then(()=>{
    console.log("db connected")
}).catch((e)=>{
    console.log('db not connected',e)
})