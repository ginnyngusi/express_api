const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const {errors} = require('../messages');
dotenv.config();

module.exports.isLoggedIn = (req, res, next) => {
    try {
        const { auth: authJWT } = req.cookies;

        if (!authJWT) {
            const {content, code} = errors["NOT_AUTHENTICATED"];
            return res.status(code).json({content});
        }
    
        jwt.verify(authJWT, process.env.JWT_KEY, (err, user) => {
            if (err) {
                const {content, code} = errors["INVALID_JWT"];
                res.status(code).json({content});
            } 
            req.locals = {};
            req.locals.loggedInUsername = user.username;
            req.locals.credit = user.credit;
            req.locals.isAdmin = user.isAdmin;
            next();
        });
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
}

module.exports.isAdmin = (req, res, next) => {
    try {
        console.log(req.locals?.isAdmin);
        if (req.locals?.loggedInUsername && req.locals?.isAdmin) next();
        else {
            const {content, code} = errors["NOT_ADMIN"];
            return res.status(code).json({content});
        }
    } catch (err) {
        const {content, code} = errors["UNKNOW_ERROR"];
        return res.status(code).json({content});
    }
}