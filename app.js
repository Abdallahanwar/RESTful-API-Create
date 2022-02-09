//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articlesSchema ={//new
  title:String,
  content: String
};

const Article = mongoose.model("Article",articlesSchema);//new

///////////////////////////////////////////////Requset targeting all articles/////////////////////////////////////////////////////////////////////
app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticle)
{
  if(!err){
    res.send(foundArticle);
  }else {
    res.send(err);
  }
});
})

.post(function(req,res) // using postman because we don't have a frontend
{
  const newArticle = new Article({
    title : req.body.title,
    content : req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("successfuly added to database");
    }else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfuly deleted all document");
    }else{
      res.send(err);
    }
  });
});

///////////////////////////////////////////////Requset targeting specific articles/////////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res)
{
  Article.findOne({title : req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("the article you are search it's not found");
    }
  })
})

.put(function(req,res){
  Article.replaceOne(
    {title : req.params.articleTitle},
    {title: req.body.title,content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("successfuly updated the article");
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title : req.params.articleTitle},
    {$set: req.body},
    {overwrite: false},
    function(err){
      if(!err){
        res.send("successfuly updated the article");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title : req.params.articleTitle},function(err){
    if(!err){
      res.send("successfuly deleted the article")
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
