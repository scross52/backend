// setup.. this is similar to when we use our default tags in html
const express = require('express')
const Song = require("./models/songs")
var cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const User = require("./models/user")

const app = express()
app.use(cors())

app.use(express.json())

const router = express.Router()
const secret = "supersecret"

//creating a new user
router.post("/user", async(req,res) => {
  if(!req.body.username || !req.body.password){
    res.stqatus(400).json({error: "Mssing username or password"})
  }

  //attempt to find username in database
  const existingUser = await User.findOne({ username: req.body.username })
  //if username exists in database, return an error
  if (existingUser) {
    return res.status(400).json({error: "Username already exists"})
  }

  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    status: req.body.status
  })

  try {
    await newUser.save()
    res.status(201) //created
  } catch(err) {
    res.status(400).send(err)
  }
})

//authenticate or login
//post request - reason why is because when you login you are creating what we call a new 'session'
router.post('/auth', async(req,res) => {
  if(!req.body.username || !req.body.password){
    res.stqatus(400).json({error: "Mssing username or password"})
    return
  }
  //try to find the username in the database, then see if it matches with a username and password
  //await finding a user
  const user = await User.findOne({username : req.body.username})

  //connection or server error
  if(!user) {
    res.status(400).send({error: "Bad Username"})
  } else {
    //check to see if the users password matches the requests password
    if (user.password != req.body.password) {
      res.status(401).json({error: "Bad Password"})
    } else {
      // succesfull login
      //create a token that is encoded with the jwt library, and send back the username.. this will be important
      //we also will send back as part of the token that you are currently authorized
      //we could do this with a boolean or a number value i.s if auth = 0 your are not authoraized, if auth = 1 you are authorized
      username2 = user.username
      const token = jwt.encode({username: user.username}, secret)
      const auth = 1

      //respond with the token
      res.json({
        username2,
        token:token,
        auth:auth
      })
    }
  }
})

router.get("/status", async(req,res) => {
  if(!req.headers["x-auth"]) {
    return res.status(401).json({error: "Missing X-Auth"})
  }

  //if x-auth contains the token (it should)
  const token = req.headers["x-auth"]
  try{
    const decoded = jwt.decode(token,secret)

    //send back all username and status fields to the user or front end
    let users = User.find({}, "username status")
    res.json(users)
  } catch (ex) {
    res.status(401).json({error: "invalid jwt"})
  }
})

// Get list of all songs in the database
router.get("/songs", async(req,res) => {
  try{
    const songs = await Song.find({})
    res.send(songs)
    res.status(201).send(songs)
  } catch (err) {
    res.status(400).send(err)
  }
})

//Grab a single song in the database
router.get("/songs/:id", async(req,res) => {
  try {
    const song = await Song.findById(req.params.id)
    res.json(song)
  } catch (err) {
    res.status(400).send(err)
  }
})

//added a song to the database
router.post("/songs", async(req,res) => {
  try {
    const song = await new Song(req.body)
    await song.save()
    res.status(201).json(song)
    console.log(song)
  } catch (err) {
    res.status(400).send(err)
  }
})

//update is to update an existing record/resource/database entry...it uses a put request
router.put("/songs/:id", async(req,res) => {
  //first we need to find and update the song the front end wants us to update.
  //to do this we need to request the id of the song from request
  //and then find it in the database and update it
  try{
    const song = req.body
    await Song.updateOne({_id: req.params.id}, song)
    console.log(song)
    res.sendStatus(204)

  }catch (err) {
    res.status(400).send(err)
  }
})


router.delete("/songs/:id", async(req,res) => {
  //method or function in mongoose/mongo to delete a single instance of a song or object
  try{
    await Song.deleteOne({_id: req.params.id})
    res.sendStatus(204)
  }catch (err) {
    res.status(400).send(err)
  }
})

//all requests that usually use an api atart with /api.. so the url would be localhost:3000/api/songs
app.use("/api", router)
app.listen(3000)