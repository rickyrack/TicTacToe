const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// allows a user to go to an authorized route or not
// does NOT set isAuth in req
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

// checks if a user is logged to determine data on an unauthorized route
// sets isLoggedIn in req
const isLoggedIn = async (req, res, next) => {
    try {
        if (req?.cookies?.jwt) {
            const token = req.cookies.jwt;
            const payload = await jwt.verify(token, secret);
            if (!req.body.username) {
                req.body.username = payload.username;
            }
            else if (req.body.username !== payload.username) {
                // if client sends unmatching username, ask to login again
                return res.status(422).redirect('/user/login');
            }
            req.isLoggedIn = true;
            next();
        } else {
            req.isLoggedIn = false;
            next();
        }
    } catch (err) {
        req.isLoggedIn = false;
        res.status(401).redirect('/user/login');
    }
}

module.exports = { isAuth, isLoggedIn };