const {User} = require("../models/user");
const {HttpError, sendEmail} = require("../helpers");
const controlWrapper = require("../decorators/controllWrapper");
const {hash, compare} = require("bcrypt");
const {sign} = require("jsonwebtoken");
const fs = require('fs').promises;
const path = require('path');
const Jimp = require("jimp");
const gravatar = require("gravatar");
const {nanoid} = require("nanoid");

const {BASE_URL} = process.env;
const avatarsDir = path.resolve('public', 'avatars');
const {SECRET_KEY} = process.env;

const controllerRegister = async (req, res) => {
    console.log(req.body);
        const {email, password} = req.body;
        let avatarURL;
        // if avatar was sent
        if (req.file) {
            const {path: oldPath, filename} = req.file;
            const newPath = path.join(avatarsDir, filename);
            await fs.rename(oldPath, newPath);
            Jimp.read(newPath)
                .then((image) => {
                    return image
                        .resize(250, 250)
                        .write(newPath);
                })
                .catch((e) => {
                    throw HttpError (400, "Bad request")
                });
             avatarURL = path.join('avatars', filename);
        }
        // if avatar was not sent
        else {
            avatarURL = gravatar.url(email, {s: '250'});
        }

        const user = await User.findOne({email});
        if(user){
            throw HttpError(409, "Email in use");
        }
        const hashPassword = await hash(password, 10)
        const verificationToken = nanoid();
        const newUser = await User.create({...req.body, avatarURL, password: hashPassword, verificationToken: verificationToken});

        const verifyEmail = {
            to: email,
            subject: 'Verify Email',
            html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}"> Click verify email </a>`
    }

        await sendEmail(verifyEmail);

        res.status(201).json({
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            }
        });
}
const controllerVerifyEmail = async (req, res) => {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw HttpError(404, 'User not found')
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationToken: ""});

    res.json({
        message: "Verification successful"
    })
}
const controllerResendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, 'User not found');
    }
    if(user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify Email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}"> Click verify email </a>`
    }

    await sendEmail(verifyEmail);

    res.status(200).json({
       message: "Verification email sent",
    });
}
const controllerLogin = async (req, res) => {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw HttpError(401, "Email or password is wrong");
        }

        if (!user.verify) {
            throw HttpError(401, "Email is not verified");
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
        console.log(res.statusCode);
        res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        })
}
const controllerLogout = async (req, res) => {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).json();
}
const controllerGetCurrent = async (req, res) => {
        const {email, subscription} = req.user;
        res.json({
            email,
            subscription,
        })
}

const controllerUpdateSubscription = async  (req, res) => {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, req.body)
        res.json();
}

const controllerUpdateAvatar = async  (req, res) => {
    const {_id} = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarsDir, filename);
    await fs.rename(oldPath, newPath);
    await Jimp.read(newPath)
        .then((image) => {
            return image
                .resize(250, 250)
                .write(newPath);
        })
        .catch((e) => {
            throw HttpError (400, "Bad request")
        });
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, {avatarURL: avatarURL})
    res.json({
        avatarURL: avatarURL
    });
}
module.exports = {
    controllerRegister: controlWrapper(controllerRegister),
    controllerLogin: controlWrapper(controllerLogin),
    controllerLogout: controlWrapper(controllerLogout),
    controllerGetCurrent: controlWrapper(controllerGetCurrent),
    controllerUpdateSubscription: controlWrapper(controllerUpdateSubscription),
    controllerUpdateAvatar: controlWrapper(controllerUpdateAvatar),
    controllerVerifyEmail: controlWrapper(controllerVerifyEmail),
    controllerResendVerifyEmail: controlWrapper(controllerResendVerifyEmail)
}