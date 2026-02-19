import User from '../models/user.js'

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId)
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        if(user.roleId === 1) {
            next()
        }else {
            return res.status(403).json({
                success: false,
                message: 'You are not admin'
            })
        }
    }catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export default isAdmin
