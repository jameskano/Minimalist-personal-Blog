// jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect('mongodb://localhost:27017/blogpracticeDB', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = new mongoose.Schema({
  title: String,
  body: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  Post.find({}, function(err, results) {
    res.render("home", {
    homeText: homeStartingContent,
    posts: results
    });
  }).sort({_id: -1});
});

app.get("/about", function(req, res){
  res.render("about", {
    aboutText: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  let post = new Post({
    title: req.body.composeTitle,
    body: req.body.composeText
  });

  post.save();
  res.redirect("/");
});

app.post("/contact", function(req, res) {
  // Instantiate the SMTP server
  const smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  // verify connection configuration
  // smtpTrans.transporter.verify(function(error, success) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });

// Specify what the email will look like
  const mailOpts = {
    from: 'Your sender info here', // This is ignored by Gmail
    to: process.env.GMAIL_USER,
    subject: 'New message from contact form at Daily Journey (blog DB)',
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      res.render('contact-failure');
    }
    else {
      res.render('contact-success');
    }
  });
});

app.get("/posts/:postId", function(req, res){
  let requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post) {
    res.render("post", {
      title: post.title,
      body: post.body
    });
  });
});


app.listen(3000, function(req, res) {
  console.log("Server is running on port 3000");
});
