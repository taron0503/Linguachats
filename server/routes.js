const express = require("express")
const User = require("./models/User") 
const router = express.Router()
const path = require('path');
const sanitizeHtml = require("sanitize-html")
var moment = require('moment');


router.post("/saveUser", async (req, res) => {
    try{
    //    const {name,surname,age,gender,country,speaks,learns} = req.body.user
        let user = req.body.user
        user = {
            name:sanitizeHtml(user.name).trim(),
            surname:sanitizeHtml(user.surname).trim(),
            age:user.age,
            gender:user.gender,
            country:user.country,
            profile_image_src:user.profile_image_src,
            learns:user.learns,
            speaks:user.speaks,
        }
        user = new User(user)
        let savedUser = await user.save()
        if(savedUser && savedUser._id){
            res.cookie("id",savedUser._id.toString(),{expires: new Date(Date.now() + 3600 * 1000 * 24 * 365)})
            res.send({saved:true})
        }
    }catch(e){
        console.log(e)
        res.send({saved:false})
    }
  })

router.post("/getUser", async (req, res) => {
    try{
        const user = await User.findOne({ _id: req.cookies.id })
        // console.log(user)
        if(user){
          
          await User.findOneAndUpdate({ _id: req.cookies.id },{lastVisit:moment().format()})
          res.send({user:user})
        }else{
          res.send({error:"notFound"})   
        }  
    }catch{
        res.status(404)
        res.send({error:"notFound"})
    }
})

router.post("/updateUser", async (req, res) => {
    try {
         const filter = {_id:req.body.id}
         const update = req.body.user
         await User.findOneAndUpdate(filter,update,{
            new: true
          })
          res.send({updated:true})
    } catch {
      res.status(404)
      res.send({ error: "User doesn't exist!" })
    }
})

router.post("/deleteUser", async (req, res) => {
    try {
      await User.deleteOne({ _id: req.cookies.id })
      res.status(204).send()
    } catch {
      res.status(404)
      res.send({ error: "User doesn't exist!" })
    }
  })

router.get('*', (req, res) => {
    // console.log(__dirname)
    // res.sendFile(__dirname + '/public/index.html');
    res.sendFile('index.html', { root: path.join(__dirname, '../build') })
  });


module.exports = router