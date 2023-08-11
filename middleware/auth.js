const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const isAuth = async (req, res, next) => {
    try {
        if (req?.cookies?.jwt) {
            const token = req.cookies.jwt;
                const payload = await jwt.verify(token, secret);
                req.body.username = payload.username;
                next();
        } else {
            res.status(400).redirect('/user/login');
        }
    } catch (err) {
        res.status(400).redirect('/user/login');
    }
}

const isLoggedIn = async (req, res, next) => {
    try {
        if (req?.cookies?.jwt !== undefined) {
            const token = req.cookies.jwt;
                const payload = await jwt.verify(token, secret);
                req.body.username = payload.username;
                next();
        } else {
            req.body.username = undefined;
            next();
        }
    } catch (err) {
        req.body.username = undefined;
        next();
    }
}

module.exports = { isAuth, isLoggedIn };