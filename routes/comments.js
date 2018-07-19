var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//show comment creation form
router.get("/new", middleware.isLoggedIn,function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
        } else{
             if (!campground) {
                return res.status(400).send("Item not found.");
            }
            res.render("comments/new", {campground: campground});
        }
    });
});

//create a comment
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            if (!campground) {
                return res.status(400).send("Item not found.");
            }
        //create new comment
        Comment.create(req.body.comment, function(err, comment){
            if (err) {
                req.flash("error", "Something went wrong");
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Successfully added comment");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
        //connect new comment to campground
        //redirect to show page for that camground
        }
    });
});
//show edit form for comments
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComments){
        if (err) {
            res.redirect("back");
        } else{
            if (!foundComments) {
                return res.status(400).send("Item not found.");
            }
            res.render("comments/edit", {campground_id: req.params.id, comments: foundComments});     
        }
    });
});
//update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            if (!updatedComment) {
                return res.status(400).send("Item not found.");
            }
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//comments destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if (err){
            res.redirect("back");
        } else {
             if (!foundComment) {
                return res.status(400).send("Item not found.");
            }
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});



module.exports = router;
