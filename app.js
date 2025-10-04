// setup.. this is similar to when we use our default tags in html
const express = require('express')
//we have to use cors in order to host a front end and backend on the same device
var cors = require('cors')
// activate or tell this app variable to be an express server
const bodyParser = require('body-parser')
const Song = require("./models/songs")
const app = express()
app.use(cors())

app.use(express.json())
const router = express.Router()

//grab all the songs in a database
router.get("/songs", async(req,res) => {
  try{
    const songs = await Song.find({})
    res.send(songs)
    console.log(songs)
  } catch (err) {
    console.log(err)
  }
})

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

//all requests that usually use an api atart with /api.. so the url would be localhost:3000/api/songs
app.use("/api", router)
app.listen(3000)