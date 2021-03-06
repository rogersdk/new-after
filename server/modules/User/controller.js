/**
 * Created by nattanlucena on 19/07/16.
 */
'user strict';
var User = require('./model');
var B = require('bluebird');


/**
 * Verify if an user already exists. Case false, create a new user. Case true, return
 *  a message in callback
 *
 * @param {Object} req
 * @param {String} req.name
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, data)
 */
var create = function (req, res) {

    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var message = {
                message: 'User already created!'
            };
            res(message);
        } else {
            User(req).save(function (err, data) {
                if (err) {
                    if (err.name === 'ValidationError') {
                        var message = {
                            message: 'Verify required fields!'
                        };
                        res(message);
                    }
                    var err = new Error(err);
                    throw err;
                }
                //User successfully created
                var message = {
                    message: 'The user was created successfully!'
                };
                res(message);
            });
        }

    });

};

/**
 *  Get an user by email
 *
 * @param {Object} req
 * @param {String} req.email
 * @param res
 */
var findByEmail = function (req, res) {
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var result = {
                name: data.name,
                email: data.email
            };

            res(result);
        } else {
            var message = {
                message: 'User not found!'
            };
            res(message);
        }

    });
};

/**
 *  Strategy for login
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, isMatch, message)
 */

var login = function (req, res) {
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        var message;
        if (!data) {
            message = {
                message: 'User not found!'
            };
            res(message);
        } else {
            var user = new User({email: req.email, password: req.password});
            user.comparePassword(req.password, data.password, function (err, data) {
               if (data) {
                   res(null, data);
               } else {
                   message = 'Incorrect password!';
                   res(null, false, message);
               }
            });
        }
    });
};

/**
 *  Remove a user account
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {Function} res - Callback
 */
var remove = function (req, res) {

    User.findOneAndRemove({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }
        var message;
        if (data) {
            message = {
                message: 'The user was removed successfully!'
            };

        } else {
            message = {
                message: 'TUser not found!'
            };
        }

        res(message);
    });

};

module.exports = {
    create : create,
    login: login,
    findByEmail: findByEmail,
    remove: remove
};