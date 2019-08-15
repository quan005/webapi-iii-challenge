const express = require("express");
const Users = require("./userDb.js");
const Post = require("../posts/postDb.js");

const router = express.Router();





//Add a user
//Expects a body with a name
router.post("/", validateUser, (req, res) => {
    Users.insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error adding the user."
        });
    });
});
  
//Add a post to a user's account
//Expects a body with text and user_id
router.post("/:id/posts", [validateUserId, validatePost], (req, res) => {
    Post.insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error adding post"
            });
        });
});
  
//Get all users
router.get("/", (req, res) => {
    Users.get(req.query)
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving users."
            });
        });
});
  
//Get users by ID
router.get("/:id", validateUserId, (req, res) => {
    Users.getById(req.params.id)
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error retrieving user."
            });
        });
});
  
//Get a user's posts
router.get("/:id/posts", validateUserId, (req, res) => {
    Users.getUserPosts(req.params.id)
        .then(posts => {
            res.status(201).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error getting user's posts."
            });
        });
});
  
//Delete a user
router.delete("/:id", validateUserId, (req, res) => {
    Users.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({
                    message: "The user has been deleted."
                });
            } else {
                res.status(404).json({
                    message: "The user could not be found."
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error deleting the user."
            });
        });
});
  
//Edit a user
router.put("/:id", [validateUser, validateUserId], (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    Users.update(id, changes)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error updating user"
            });
        });
});
  




// Custom MiddleWare Function
function validateUserId(req, res, next) {
    const { id } = req.params;
  
    Users.getById(id)
        .then(user => {
            if (user) {
                next();
            } else {
                res.status(404).json({ message: "No user with given id." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error processing request."
            });
        });
}
  
function validateUser(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
    } else {
        next({ message: "Bad request." });
    }
}
  
function validatePost(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
    } else {
        next({ message: "Bad request." });
    }
}
  
module.exports = router;
