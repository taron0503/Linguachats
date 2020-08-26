const express = require("express")
const User = require("./models/User") 
const router = express.Router()
const path = require('path');

router.post("/saveUser", async (req, res) => {
    try{
    //    const {name,surname,age,gender,country,speaks,learns} = req.body.user
    const user = new User(req.body.user)
    //    console.log(req.body)
        // const user = new User({
        //     name:"Elon",
        //     surname:"Musk",
        //     age:"45",
        //     gender:"Male",
        //     country:"United Kingdom",
        //     speaks:["English"],
        //     learns:["Spanish"]
        // });
        let savedUser = await user.save()
        if(savedUser && savedUser._id){
            res.send({saved:true,id:savedUser._id})
        }
    }catch{
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