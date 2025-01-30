const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "*"
};
const serverPort =  2525;
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

const db = require("./app/models");

const TopWins = db.TopWins;

const serverDB="mongodb+srv://208shaghayegh:3c9bEiO5kVSzfAeE@wheel.d4e9q.mongodb.net/usdtpoker";

db.mongoose
  .connect(serverDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch((err) => {
    console.error("Connection error", err);
    //process.exit();
  });

  app.get("/lastlist", async (req, res) => {
  
    const userswin = await TopWins.find(
      {win : { $gt: 2999999 }},{ userdata: 1,game:1,username:1,x:1,date:1,win:1 }
    )

      .limit(100).sort({date:-1});
    
  res.json(userswin);


});
app.get("/biglist", async (req, res) => {
  
  const userswin = await TopWins.find(
    {win : { $gt: 3000000 }},{ userdata: 1,game:1,username:1,x:1,date:1,win:1 }
  )

    .limit(100).sort({win:-1});
  
res.json(userswin);


});

app.post("/add", async (req, res) => {
  if(req.body.userdata.x>3 || req.body.userdata.win>=30){
  const bet = new TopWins({
    game: req.body.game,
    userdata: JSON.stringify(req.body.userdata),
    alldata: JSON.stringify(req.body.alldata),
    username:req.body.userdata.nickname,
    win:req.body.userdata.win,
    x:req.body.userdata.x,

  });
  const myres = await bet.save();

  return res.status(200).json(myres);
}else{
  return res.status(200).json(req.body.userdata);
}

});


app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}.`);
  
});
