//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose")

// MongoDB Atlas connection string
const uri = 'mongodb+srv://Abhiram:Abhiram%401567@blog.nko15kb.mongodb.net/blogdb?retryWrites=true&w=majority';
// Replace <username>, <password>, <cluster-url>, and <database-name> with your actual values.

mongoose.connect(uri, {
  useNewUrlParser: true
})

const postschema = mongoose.Schema(
  {
    title: String,
    message: String
  }
)

const Post = mongoose.model("post", postschema)

const homeStartingContent = "Welcome to my blog! This is the place where I share my thoughts, ideas, and experiences. Stay tuned for exciting and informative posts.";
const aboutContent = "I'm a passionate writer who loves to explore various topics and share my insights. Through this blog, I aim to inspire and engage readers with interesting content. Feel free to join me on this journey.";
const contactContent = "I would love to hear from you! If you have any questions, suggestions, or just want to say hello, please don't hesitate to reach out. You can contact me via email or connect with me on social media.";

const posts = []

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {

  Post.find()
    .then((posts) => {
      const data = {
        start: homeStartingContent,
        posts: posts
      }
      res.render("home", data)
    })
    .catch((err) => {
    console.log("Error : " + err)
  })
})

app.get("/about", (req, res) => {
  res.render("about", { about: aboutContent })
})

app.get("/contact", (req, res) => {
  res.render("contact", { contact: contactContent })
})

app.get("/compose", (req, res) => {
  res.render("compose")
})

app.get("/posts/:postName", (req, res) => {

  const requestedTitle = _.kebabCase(req.params.postName);

  Post.find()
    .then((posts) => {
      posts.forEach((post) => {

        const storedTitle = _.kebabCase(post.title);
        if (storedTitle === requestedTitle) {
          const data = {
            title: post.title,
            message: post.message
          }
          res.render("post", data)
        }
      })
  })

})

app.post("/compose", (req, res) => {
  const post = new Post(
    {
      title: req.body.postTitle,
      message: req.body.postMessage
    }
  )
  post.save()
  res.redirect("/")
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
