//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const path=require('path');
const { log } = require("console");

//setting app
const app = express();

//view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

dotenv.config({
  path: "config/config.env",
});


//mongodb connection
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const schema=new mongoose.Schema({
  name : String,
})

const Item=mongoose.model("item",schema);

const item1=new Item({
  name: "PAdhna Hai bsdk",
})
const item2=new Item({
  name: "PAdh le bsdk",
})
const item3=new Item({
  name: "kab PAdhega bsdk",
})

const defaultItems=[item1,item2,item3];

app.get("/", async function(req, res) {
  let result= await Item.find({});
  if(result.length===0){
    Item.insertMany(defaultItems)
    .then(()=>{
      console.log("Successfully Inserted Items To Db");
    })
    .catch((err)=>{
      console.log(err);
    })
    res.redirect("/"); 
  }
  else{
    res.render("list",{listTitle:"today",newListItems:result});
  }
});

app.post("/", function(req, res){

  const itemName=req.body.newItem;
  const item=new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", (req,res)=>{
  const itemtodel=req.body.Checkbox;
  Item.findByIdAndDelete(itemtodel)
  .then(()=>{
    console.log("Sucessfully deleted");
  })
  .catch((errr)=>{
    console.log(errr);
  })  
  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(process.env.PORT, function() {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
