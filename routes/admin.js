const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

const userModel = require('../models/User');
const {errors, messages} = require('../messages');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

dotenv.config();

router.get('/list_user', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const allUser = await userModel.find();
        
        return res.status(200).json(allUser);
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
});

router.put('/update_user', isLoggedIn, isAdmin, async (req, res) => {
    try {
        if (!req.body.username || !req.body.newUser) {
            const {content, code} = errors["EMPTY_FIELDS"];
            return res.status(code).json({content});
        }
        const {password, isAdmin, credit} = req.body.newUser;
        await userModel.findOneAndUpdate({username: req.body.username}, {
            $set: {
                password,
                isAdmin,
                credit
            }
        });

        const {content, code} = messages["SUCCESS"];
        return res.status(code).json({content});
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
});

router.delete('/delete_user/:username', isLoggedIn, isAdmin, async (req, res) => {
    try {
        await userModel.findOneAndDelete({username: req.params.username});

        const {content, code} = messages["SUCCESS"];
        return res.status(code).json({content});
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
});

router.post('/add_user', isLoggedIn, isAdmin, async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            const {content, code} = errors["EMPTY_FIELDS"];
            return res.status(code).json({content});
        }

        const {username, password} = {username: req.body.username, password: req.body.password};
        const user = await userModel.findOne({username});

        if (user) {
            const {content, code} = errors["USER_EXIST"];
            return res.status(code).json({content});
        }

        const hash = bcrypt.hashSync(password, 10);
        const newUser = new userModel();
        
        newUser.username = username;
        newUser.password = hash;
        newUser.credit = req.body.credit || 0;
        newUser.isAdmin = req.body.isAdmin || false;
        await newUser.save();

        const {content, code} = messages["SUCCESS"];
        return res.status(code).json({content});
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
});

module.exports = router;
