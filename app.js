//jshint esversion:6
//define main variables
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const connectData = require("./config");
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const login = connectData.login;
const password = connectData.password;

mongoose.connect(`mongodb+srv://${login}:${password}@cluster0.uskxewj.mongodb.net/blogApp`);

const contentsSchema = new mongoose.Schema({
  contentName: String,
  contentValue: String
});

const postsSchema = new mongoose.Schema({
  postName: String,
  postValue: String
});

const Content = mongoose.model('Content', contentsSchema);

const Post = mongoose.model('Post', postsSchema);

const homeStartingContent = new Content({
  contentName: "homeStartingContent",
  contentValue: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."});
const aboutContent = new Content({
  contentName: "aboutContent",
  contentValue:"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."});
const contactContent = new Content({
  contentName: "contactContent",
  contentValue:"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."});

// home page
app.get('/', (req, res) => {

  Content.findOne({contentName: 'homeStartingContent'}, function(err, foundContent) {
    if (err) {
      console.log(err);
    } else {
      if (!foundContent) {
        Content.create(homeStartingContent, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Content inserted successfully!'); 
          }
        });
        res.redirect("/");
      } else {
        const homeStarting = foundContent.contentValue;
        Post.find({}, function (err, findPosts) {
          if (err) {
            console.log(err);
          } else {
            const posts =  findPosts;
            res.render("home", {homeStarting: homeStarting, posts: posts});
          }
        });
      }
    }
  });

});

// about page
app.get('/about', (req, res) => {

  Content.findOne({contentName: 'aboutContent'}, function(err, foundContent) {
    if (err) {
      console.log(err);
    } else {
      if (!foundContent) {
        Content.create(aboutContent, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Content inserted successfully!'); 
          }
        });
        res.redirect("/about");
      } else {
        const aboutStarting = foundContent.contentValue;
        res.render('about', {about: aboutStarting});
      }
    }
  });

});

// contact page
app.get('/contact', (req, res) => {

  Content.findOne({contentName: 'contactContent'}, function(err, foundContent) {
    if (err) {
      console.log(err);
    } else {
      if (!foundContent) {
        Content.create(contactContent, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Content inserted successfully!'); 
          }
        });
        res.redirect("/contact");
      } else {
        const contactStarting = foundContent.contentValue;
        res.render('contact', {contact: contactStarting});
      }
    }
  });

});

// page compose
app.get('/compose', (req, res) => {
  res.render('compose');
});

// page post
app.get('/posts/:postId', (req, res) => {

  const postId = req.params.postId;
  
  Post.findOne({_id: postId}, function(err, post){
    res.render("post", {
      postName: post.postName, 
      currentPost: post.postValue
    });
  }); 

});

// page home post
app.post('/', (req, res) => {

  Post.create({postName: req.body.postTitle, postValue: req.body.postBody}, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Post inserted successfully!'); 
    }
  });

  res.redirect('/');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
