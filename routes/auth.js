const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const userModel = require('../models/User');
const {errors, messages} = require('../messages');
const { isLoggedIn } = require('../middlewares/auth');

dotenv.config();

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        const {content, code} = errors["EMPTY_FIELDS"];
        return res.status(code).json({content});
        }

        const user = await userModel.findOne({username});
        if (!user) {
        const {content, code} = errors["LOGIN"];
        return res.status(code).json({content});
        }

        bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            const {content, code} = errors["UNKNOW_ERROR"];
            return res.status(code).json({content});
        }

        if (result) {
            const {content, code} = messages["LOGIN_SUCCESS"];
            const jwtCookie = jwt.sign({
            username, 
            credit: user.credit,
            isAdmin: user.isAdmin
            }, process.env.JWT_KEY);

            res.cookie("auth", jwtCookie, {
            maxAge: 7200000, //expire after 2 hours
            httpOnly: true,
            secure: true
            });
            return res.status(code).json({content});
        } else {
            const {content, code} = errors["LOGIN_FAILED"];
            return res.status(code).json({content});
        }
        });
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }  
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
        const {content, code} = errors["EMPTY_FIELDS"];
        return res.status(code).json({content});
        }

        const user = await userModel.findOne({username});

        if (user) {
        const {content, code} = errors["USER_EXIST"];
        return res.status(code).json({content});
        }

        const hash = bcrypt.hashSync(password, 10);
        const newUser = new userModel();
        
        newUser.username = username;
        newUser.password = hash;
        newUser.credit = 0;
        newUser.isAdmin = false;
        await newUser.save();
        
        const jwtCookie = jwt.sign({
        username, 
        credit: newUser.credit,
        isAdmin: newUser.isAdmin
        }, process.env.JWT_KEY);
        const {content, code} = messages["REGISTER_SUCCESS"];

        res.status(code).cookie("auth", jwtCookie, {
        maxAge: 7200000, //expire after 2 hours
        httpOnly: true,
        secure: true
        }).json({content})
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
});
  
router.put('/updatePassword', isLoggedIn, async (req, res) => {
    try {
        const username = req.locals.loggedInUsername;
        if (!username) {
        const {content, code} = errors["NOT_AUTHENTICATED"];
        return res.status(code).json({content});
        }

        if (!req.body.password || !req.body.oldPassword) {
        const {content, code} = errors["EMPTY_FIELDS"];
        return res.status(code).json({content});
        }

        const password = req.body.password;
        const oldPassword = req.body.oldPassword;

        const user = await userModel.findOne({username});

        if (!user) {
        const {content, code} = errors["USER_NOT_FOUND"];
        return res.status(code).json({content});
        }

        bcrypt.compare(oldPassword, user.password, async (err, result) => {
        if (err) {
            const {content, code} = errors["UNKNOW_ERROR"];
            return res.status(code).json({content});
        } else if (!result) {
            const {content, code} = errors["OLD_PASSWORD_NOT_MATCH"];
            return res.status(code).json({content});
        }

        const hash = bcrypt.hashSync(password, 10);
        await userModel.findOneAndUpdate({username}, {
            $set: {
            username: username,
            password: hash
            }
        });
        const {content, code} = messages["SUCCESS"];
        return res.status(code).json({content});
        });
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content: err.toString()});
    }
});

module.exports = router;
