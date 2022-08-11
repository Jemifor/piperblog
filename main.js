//require packages
//jshint esversion:6
//require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const sql = require("sql");
const mysql = require("mysql");
const listenPort = 3000;
const lodash = require("lodash");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

const app = express(); //represent express modules
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true }); //connect to mongoose data base
//mongoose.set("useCreateIndex", true);

//use modules
app.use(bodyParser.urlencoded({ extended: true })); //usee bodyParser content
app.use(express.static("public")); //use static public files
app.set("view engine", "ejs"); //set ejs view engine

// app.use(session({
//   blog: "Our daily post",
//   resave: false,
//   saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

//create schema
const blogSchema = mongoose.Schema({
  title: String,
  category: String,
  content: String,
});
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  userView: blogSchema,
});
// const usersData = new mongoose.Schema({
//   username: ,
//   password: ,
// });

//userSchema.plugin(passportLocalMongoose);

//create model
const adminModel = mongoose.model("admin", adminSchema);
const blogModel = mongoose.model("blog", blogSchema);

// passport.use(adminModel.createStrategy());

// passport.serializeUser(adminModel.serializeUser());
// passport.deserializeUser(adminModel.deserializeUser());

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

app.get("/admin", function (request, response) {
  response.redirect("/admin/login");
});
app.post("/admin/login", function (request, response) {
  const username = request.body.username;
  const password = request.body.password;
  // const adminLoginData = new adminModel({
  //   username: username,
  //   password: password
  // });
  // adminLoginData.save(function(error){
  //   if(!error){
  //     console.log("Saved Data !!!");
  //   }else{
  //     console.log(error);
  //   }
  // });
  const adminId = "62f0f9809506f972d2887d42";
  adminModel.findOne({ username: username }, function (error, adminData) {
    if (error) {
      console.log(error);
    } else {
      if (adminData.password === password) {
        response.render("admin/index");
      } else {
        response.render("admin/login", {
          wrongInput: "Username and password incorrect !!!",
        });
      }
    }
  });
});
app.get("/admin/login", function (request, response) {
  response.render("admin/login");
});

app.post("/admin/index", function (request, response) {
  const title = request.body.title;
  const category = request.body.category;
  const content = request.body.content;
  const blogData = new blogModel({
    title: title,
    category: category,
    content: content,
  });
  const adminSave = new adminModel({
    userView: blogData
  }); //save to year to end section
  adminModel.insertMany([blogData, adminSave], function (error) {
    if (error) {
      console.log(error);
    } else {
      response.redirect("/admin/index");
    }
  });
  blogData.save(function(error){
    if(error){
      console.log(error);
    }else{
      console.log("Saved Successfully");
    }
  });
});
app.get("/admin/index", function (request, response) {
  response.render("admin/index");
});

app.post("/admin/integrate", function(request, response){
  const blogId = request.body.blogId;
  blogModel.findByIdAndRemove(blogId, function(error){
    if(error){
      console.log(error);
    }else{
      response.redirect("/admin/integrate");
    }
  });
});
app.get("/admin/integrate", function(request, response){
  blogModel.find({}, function(error, results){
    if(error){
      console.log(error);
    }else{
      response.render("admin/integrate",{integratePost: results});
    }
  });
});

app.get("/admin/sign-out", function (request, response) {
  response.redirect("/admin/login");
});

app.get("/post/:postName", function(request, response){
  const requestedRoutes = lodash.lowerCase(request.params.postName);
  blogModel.find({title: requestedRoutes}, function(error, blogPosts){
    if(error){
      console.log(error);
    }else{
      response.render("users/index", {blogPost: blogPosts});
    }
  });
});
app.post("/post/:postName", function(request, response){

});

app.get("/navsroutes:navName", function(request, response){
  const navNameRoute = request.params.navName;
  blogModel.find({title: navNameRoute}, function(error, foundData){
    if(error){
      console.log(error);
    }else{
      response.render("navslink", {blogCard: foundData});
    }
  });
});

app.get("/", function(request, response){
  blogModel.find({}, function(error, result){
    if(error){
      console.log(error);
    }else{
      response.render("users/home", {blogPost: result});
    }
  });
});
app.get("/post", function(request, response){
  response.redirect("/");
});

//create listen port
app.listen(listenPort, function () {
  console.log("Server has started on port 3000");
});
