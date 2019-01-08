const express = require('express');
const router = express.Router();
const userService = require('./user.service');

module.exports = router;

router.post('/login', login);
router.post('/create', create);
router.post('/forgot', forgot);
router.post('/reset/', reset);
router.get('/current', getCurrent);
router.delete('/:id', deleteUser);

function login(req, res, next){
    userService.login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: "Invalid credentials"}))
        .catch(err => next(err));
}

function create(req, res, next){
    userService.create(req.body)
        .then(email => res.json({message: `User with email id ${email} has successfully been created`}))
        .catch(err => next(err));
}

function forgot(req, res, next){
    userService.forgot(req.body)
        .then(user => {
            // We actually need to email this token to the user's email and also expose a GET endpoint for reset link that will be sent to him.
            // Meanwhile just copy paste this token from server's console to postman.
            console.log(user.resetToken);
            return res.json({message: "Reset token has successfully been generated and logged to server console. Please use the same for resetting"});
        })
        .catch(err => next(err));
}

function reset(req, res, next){
    userService.reset(req.body)
        .then(user => res.json({message: `Password has been successfully updated for the user with email ${user.email}`}))
        .catch(err => next(err));
}

function getCurrent(req, res, next){
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.status(404).json({message: "No user is currently logged in"}))
        .catch(err => next(err));
}

function deleteUser(req, res, next){
    userService.deleteUser(req.params.id)
        .then(() => res.json({message: "User has successfully been deleted"}))
        .catch(err => next(err));
}
