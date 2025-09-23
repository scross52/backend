// setup.. this is similar to when we use our default tags in html
const express = require('express')
//we have to use cors in order to host a front end and backend on the same device
var cors = require('cors')
// activate or tell this app variable to be an express server
const app = express()
app.use(cors())
const router = express.Router()

//making an api using routes
// Routes are used t ohandle browser requests. They look like URLs. The difference is that when a browser requests a route, it dynamically handled by using a function.

router.get("/songs", function(req,res){
  const songs = [
    {
      title: "Uptown Funk",
      artist: "Bruno Mars",
      popularity: 10,
      genre: ["funk", "boogie"]
    },
    {
      title: "We Found Love",
      artist: "Rihanna",
      popularity: 10,
      genre: ["electro house"]
    }
  ]

  res.json(songs)
})

//all requests that usually use an api atart with /api.. so the url would be localhost:3000/api/songs
app.use("/api", router)
app.listen(3000)