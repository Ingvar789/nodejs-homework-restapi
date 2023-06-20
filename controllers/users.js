const {User} = require("../models/user");
const {HttpError} = require("../helpers");
const {hash, compare} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const {SECRET_KEY} = process.env;
const controllerRegister = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(user){
            throw HttpError(409, "Email in use");
        }

        const hashPassword = await hash(password, 10)

        const newUser = await User.create({...req.body, password: hashPassword});

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        });
    }
    catch (e){
        next(e);
    }
}

const controllerLogin = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw HttpError(401, "Email or password is wrong");
        }

        const passwordCompare = await compare(password, user.password)
        if(!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }

        const payload = {
            id: user._id,
        }
        const token = sign(payload, SECRET_KEY, {expiresIn: "23h"});
        await  User.findByIdAndUpdate(user._id, {token});
        res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        })
    }
    catch (e) {
        next (e)
    }
}

const controllerLogout = async (req, res, next) => {
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).json();
    }
    catch (e) {
        next(e);
}
}
const controllerGetCurrent = async (req, res, next) => {
    try {
        const {email, subscription} = req.user;
        res.json({
            email,
            subscription,
        })
    }
    catch (e){
        next(e);
    }
}

const controllerUpdateSubscription = async  (req, res, next) => {
    try{
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, req.body)
        res.json();
    }
    catch (e){
        next(e);
    }
}
module.exports = {
    controllerRegister,
    controllerLogin,
    controllerLogout,
    controllerGetCurrent,
    controllerUpdateSubscription,
}