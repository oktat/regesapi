import bcrypt from 'bcryptjs'
import User from '../models/user.js'

const UserController = {
    async index(req, res) {
        try {
            UserController.tryIndex(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!'
            })
        }
    },
    async tryIndex(req, res) {
        const users = await User.findAll()
        res.status(200)
        res.json({
            success: true,
            data: users
        })
    },
    async show(req, res) {
        try {
            await UserController.tryShow(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!'
            })
        }
    },
    async tryShow(req, res) {
        const user = await User.findByPk(req.params.id)
        res.status(200)
        res.json({
            success: true,
            data: user
        })
    },
    async create(req, res) {
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
            await UserController.tryCreate(req, res)
        }catch(error) {
            if (clientError) {
                res.status(400)
            }else {
                res.status(500)
            }
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryCreate(req, res) {
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        }        
        const userData = await User.create(newUser)
        res.status(201)
        res.json({
            success: true,
            data: userData
        })
    },
    async updatePassword(req, res) {
        var clientError = false;
        try {
            if(!req.body.password ||
                !req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! Bad request data!')
            }
            if(req.body.password != req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! The two password is not same!')
            }
            await UserController.tryUpdatePassword(req, res)
        }catch(error) {
            if (clientError) {
                res.status(400)
            }else {
                res.status(500)
            }
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryUpdatePassword(req, res) {
        const user = await User.findByPk(req.params.id)
        user.password = bcrypt.hashSync(req.body.password)
        await user.save()
        res.status(200)
        res.json({
            success: true,
            data: user
        })
    },
    async destroy(req, res) {
        try {
            await UserController.tryDestroy(req, res)
        }catch(error) {
            res.status(500)
            res.json({
                success: false,
                message: 'Error! The query is failed!',
                error: error.message
            })
        }
    },
    async tryDestroy(req, res) {
        const user = await User.destroy({
            where: { id: req.params.id }
        })
        res.status(200)
        res.json({
            success: true,
            data: user
        })
    }
}

export default UserController
