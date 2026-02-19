import User from '../models/user.js'

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.userId)
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                })
            }
            const roles = [0, 1, 2]
            const userRoleLevel = roles.indexOf(user.roleId)
            const requiredRoleLevel = roles.indexOf(requiredRole)

            if(userRoleLevel >= requiredRoleLevel) {
                next()
            }else {
                return res.status(403).json({
                    success: false,
                    message: 'You are not allowed to do this action'
                })
            }
        }catch(err) {
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}

export default checkRole
