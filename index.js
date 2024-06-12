// importing the necessary npm modules
import express from "express";
import bodyParser from "body-parser";

function createID(title) {
    // Convert to lowercase
    let id = title.toLowerCase();

    // Replace spaces and special characters with hyphens
    id= id.replace(/[^a-z0-9\s-]/g, ''); // Remove all non-alphanumeric characters except spaces and hyphens
    id = id.replace(/\s+/g, '-'); // Replace spaces with hyphens
    id = id.replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen

    // Trim hyphens from the start and end of the string
    id = id.replace(/^-+|-+$/g, '');

    return id;
}
var post =[]; // creating an empty array to save posts
const app = express();
const port = 3000;

app.use(express.static("public")); // for rendering the static files in public folder
app.use(bodyParser.urlencoded({ extended: true })); // incorporating  body parser

// sending the posts to home page
app.get("/",(req,res)=>{
    res.render("index.ejs",{
        posts:post
    });
});
// rendering the about page
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
//rendering the compose page 
app.get("/compose",(req,res)=>{
    res.render("compose.ejs");
});
// rendering the contact page
app.get("/contact",(req,res)=>{
    res.render("contact.ejs");
});

// for posting the composed blog
app.post("/compose",(req,res)=>{
    var postObject={
        title: req.body.postTitle,
        content:req.body.postContent,
        id:(createID(req.body.postTitle)),
    };
   
    post.push(postObject);
    res.redirect("/");

});
// defining variables
var curr_post_id;
var curr_post_title;
var curr_post_content;

// redndering the individual posts
app.get("/posts/:postID",(req,res)=>{
    const index = post.findIndex(post => post.id === req.params.postID);
    var post_wanted = post[index];
    curr_post_id = post_wanted.id;
    var title_w = post_wanted.title;
    curr_post_title = title_w;
    var content_w = post_wanted.content;
    curr_post_content = content_w;
    res.render("post.ejs",{
        title: title_w,
        content: content_w,
    })
})

// route to edit the post, it renders the already entered content
app.post("/edit",(req,res)=>{
    

    res.render("edit.ejs",{
        title: curr_post_title,
        content : curr_post_content,
        id : curr_post_id
    });

});

// route to handle edited posts
app.post("/edited",(req,res)=>{
    const index = post.findIndex(post => post.id === curr_post_id);
    post[index].title =req.body.postTitle;
    post[index].content =req.body.postContent;
    post[index].id = createID(req.body.postTitle);
    res.redirect("/");

});
// route to delete the post
app.post("/delete",(req,res)=>{
const index = post.findIndex(post => post.id === curr_post_id);
post.splice(index,1);
res.redirect("/");
});
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});