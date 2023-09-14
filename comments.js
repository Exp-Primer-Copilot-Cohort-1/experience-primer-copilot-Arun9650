// Create web server


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var post = require('./models/post');

// Connect to Mongodb
mongoose.connect('mongodb://localhost/comments');

// Configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Set port
var port = process.env.PORT || 8080;

// Create a router for API
var router = express.Router();

// Middleware for all requests
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// Test route
router.get('/', function(req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

// Routes for /comments
router.route('/comments')

    // Create a comment
    .post(function(req, res) {
        var comment = new Comment();
        comment.name = req.body.name;
        comment.text = req.body.text;
        comment.post_id = req.body.post_id;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Comment created!'});
        });
    })

    // Get all comments
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

// Routes for /comments/:comment_id
router.route('/comments/:comment_id')

    // Get a comment
    .get(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json(comment);
        });
    })

    // Update a comment
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            comment.name = req.body.name;
            comment.text = req.body.text;
            comment.post_id = req.body.post_id;
            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Comment updated!'});
            });
        });
    })

    // Delete a comment
    .delete(function(req, res) {
        Comment.remove({
            _id : req.params.comment_id
        }, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Successfully deleted'});
        }
    );
});
