//Create web server
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;
const path = require('path');
const { json } = require('body-parser');
const { request } = require('http');

//Parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Get all comments
app.get('/comments', (req, res) => {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            throw err;
        }
        res.send(JSON.parse(data));
    });
});

//Get all comments with specific ID
app.get('/comments/:id', (req, res) => {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            throw err;
        }
        let comment = JSON.parse(data);
        let commentID = comment.find(item => item.id === parseInt(req.params.id));
        if (!commentID) {
            res.status(404).send('Comment not found');
        }
        res.send(commentID);
    });
});

//Post a comment
app.post('/comments', (req, res) => {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            throw err;
        }
        let comment = JSON.parse(data);
        let newComment = {
            id: req.body.id,
            name: req.body.name,
            email: req.body.email,
            body: req.body.body
        };
        comment.push(newComment);
        fs.writeFile('comments.json', JSON.stringify(comment, null, 2), (err) => {
            if (err) {
                throw err;
            }
            res.send('Comment added successfully');
        });
    });
});

//Update a comment
app.put('/comments/:id', (req, res) => {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            throw err;
        }
        let comment = JSON.parse(data);
        let updateComment = comment.find(item => item.id === parseInt(req.params.id));
        if (!updateComment) {
            res.status(404).send('Comment not found');
        }
        updateComment.name = req.body.name;
        updateComment.email = req.body.email;
        updateComment.body = req.body.body;
        fs.writeFile('comments.json', JSON.stringify(comment, null, 2), (err) => {
            if (err) {
                throw err;
            }
            res.send('Comment updated successfully');
        });
    });
});

//Delete a comment
app.delete('/comments/:id', (req, res) => {
    fs.readFile('comments.json', (err, data) => {
        if (err) {
            throw err;
        }
        let comment = JSON.parse(data);
        let deleteComment = comment.find(item => item.id === parseInt(req.params.id));
        if (!deleteComment) {
            res.status(404).send('Comment not found');
        }
        comment.splice(comment.indexOf(deleteComment), 1);
        fs.writeFile('comments.json', JSON.stringify(comment, null, 2), (err) => {
            if (err) {
                throw err;
            }
            res.send('Comment deleted successfully');
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});