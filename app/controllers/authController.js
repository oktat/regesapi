import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import sendEmail from '../services/email.service.js'
import crypto from 'crypto'
import dotenvFlow from 'dotenv-flow'
dotenvFlow.config() 

const AuthController = {
    async register(req, res) {        
        var clientError = false;
        try {
            if(!req.body.name ||
                !req.body.email ||
                !req.body.password ||
                !req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! Bad request data!')
            }
            if(req.body.password != req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! The two password is not same!')
            }
            const user = await User.findOne({
                where: { name: req.body.name }
            })
            if(user) {
                clientError = true
                throw new Error('Error! User already exists: ' + user.name)
            }
            AuthController.tryRegister(req, res)
        } catch (error) {
            if (clientError) {
                res.status(400)
            }else {
                res.status(500)
            }            
            await res.json({
                success: false,
                message: 'Error! User creation failed!',
                error: error.message
            })            
        }
    },
    async tryRegister(req, res) {
        const verificationToken = crypto.randomBytes(32).toString('hex')
        const verifyUrl = process.env.APP_URL + '/verify-email/' + verificationToken

        const user = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password),
            verificationToken: verificationToken
        }
        const result = await User.create(user)

        sendEmail({
            email: req.body.email,
            subject: 'Regisztráció',
            html: `Regisztráció megerősítése:<br>
            ${verifyUrl}
            `
        })        
        res.status(201).json({
            succes: true,
            data: result
        })
        
    },
    async login(req, res) {
        
        try {
            if(!req.body.name || !req.body.password) {
               res.status(400)
               throw new Error('Error! Bad name or password!')
            }
            const user = await User.findOne({
                where: { name: req.body.name }
            })

            if(!user) {
                res.status(404)
                throw new Error('Error! User not found!')
            }
            var passwordIsValid = await bcrypt.compare(
                req.body.password,
                user.dataValues.password
            );
            if(!passwordIsValid) {
                res.status(401)
                throw new Error('Error! Password is not valid!')
            }
            AuthController.tryLogin(req, res, user)

        } catch (error) {
            res.json({
                success: false,
                message: 'Error! The login is failed!',
                error: error.message
            })
        }
    },
    async tryLogin(req, res, user) {
        var token = jwt.sign({ id: user.id }, process.env.APP_KEY, {
            expiresIn: 86400 //24 óra
        })
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token
        })            
    },
    async verifyEmail(req, res) {
        const user = await User.findOne({
            where: { verificationToken: req.params.token }
        })
        if(!user) {
            res.status(404)
            throw new Error('Error! User not found!')
        }
        user.verified = true
        await user.save()
        

        res.status(200).json({
            success: true,
            message: 'The email is verified!',

        })
    }
}
 
export default AuthController
