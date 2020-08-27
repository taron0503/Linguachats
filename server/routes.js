const express = require("express")
const User = require("./models/User") 
const router = express.Router()
const path = require('path');
const sanitizeHtml = require("sanitize-html")

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
            speaks:user.speaks
        }
        user = new User(user)
        let savedUser = await user.save()
        if(savedUser && savedUser._id){
            res.send({saved:true,id:savedUser._id})
        }
    }catch(e){
        console.log(e)
        res.send({saved:false})
    }
  })

router.post("/getUser", async (req, res) => {
    try{
        console.log(req.body)
        const user = await User.findOne({ _id: req.body.id })
        console.log(user)
        res.send({user:user})
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
      await User.deleteOne({ _id: req.params.id })
      res.status(204).send()
    } catch {
      res.status(404)
      res.send({ error: "User doesn't exist!" })
    }
  })

router.get('*', (req, res) => {
    console.log(__dirname)
    // res.sendFile(__dirname + '/public/index.html');
    res.sendFile('index.html', { root: path.join(__dirname, '../build') })
  });

module.exports = router