import db from '../models/index.js'
import {generateAccessToken} from '../utilities/authentication.js'
import {deleteImage, s3SharpImageUpload, userProfileImage} from './aws.js'
import {comparePassword} from '../utilities/passwordUtils.js'
import {updatePassword} from './userService.js'

const adminLogin = async (req) => {
    try {
        const {email, password} = req.body
        const adminEmail = email.toLowerCase()
        const adminData = await db.Admin.findOne({where: {email: adminEmail}})
        const checkPassword = await comparePassword(password, adminData?.password)
        if (adminData && checkPassword) {
            const auth_token = await generateAccessToken(adminData)
            return {
                status: true,
                message: 'Admin logged in successfully',
                data: {admin: adminData, token: auth_token}
            }
        }
        return {
            status: false,
            message: 'Wrong email or password'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
const addProduct = async (req) => {
    try {
        const {p_name, price, p_image, details} = req.body
        const product = await db.Product.create({p_name: p_name, price: price, p_image: p_image, details: details})
        return {
            status: true,
            message: 'Product Created Successfully'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
const viewStats = async (req) => {
    try {
        const users = await db.User.count()
        return {
            status: true,
            message: 'Dashboard stats',
            data: {all_user: users}
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const userProfileUpdated = async (req) => {
    try {
        const {profile} = req.body
        if (profile) {
            if (profile.startsWith('data:image')) {
                await userProfileImage(profile)
            }
            return {
                status: true,
                message: 'User profile updated'
            }
        }
        return {
            status: false,
            message: 'Something went wrong. Please try again later.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateUser = async (req) => {
    try {
        let popup = []
        // const u_id = await getUserIdFromToken(req)
        const {new_profile_image, bio, email, user_name, home_location, id, new_password} = req.body
        let updatedProfile = null
        if (user_name) {
            const userNameExist = await db.User.findOne({where: {user_name: user_name, id: {[db.Op.ne]: id}}})
            if (userNameExist) {
                return {
                    status: false,
                    message: `Username not available`
                }
            }
        }
        if (email) {
            const userEmailExist = await db.User.findOne({where: {email: email, id: {[db.Op.ne]: id}}})
            if (userEmailExist) {
                return {
                    status: false,
                    message: `Email not available`
                }
            }
        }
        const user = await db.User.findOne({where: {id: id}})
        if (user) {
            if (new_profile_image) {
                updatedProfile = await s3SharpImageUpload(new_profile_image)
                user?.profile_image != 'gamba.png' ? await deleteImage(user?.profile_image) : ''
            }
            let profile_image = updatedProfile ? updatedProfile : user?.profile_image
            const update_user = await db.User.update({...req.body, profile_image: profile_image, bio: bio != '' ? bio : '', parse_objId: null}, {where: {id: user?.id}})
            if (new_password) {
                await updatePassword(req)
            }
            if (update_user) {
                let updatedUser = await db.User.findOne({where: {id: id}})
                popup = [...popup]
                updatedUser = await db.User.findOne({where: {id: id}})
                updatedUser.password = ''
                return {
                    status: true,
                    message: `Changes saved successfully`,
                    data: {updatedUser: updatedUser, popUp: popup}
                }
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
// View All Tastes
const viewAllUserTaste = async (req) => {
    try {
        const {u_id} = req.query
        const user = await db.User.findOne({where: {id: u_id}})
        if (user) {
            const allTastes = await db.UserTaste.findAll({where: {u_id: u_id}})
            if (allTastes) {
                let tasteNameArray = []
                for (let i = 0; i < allTastes.length; i++) {
                    const tasteName = await db.Taste.findOne({where: {id: allTastes[i].t_id}})
                    tasteNameArray.push({t_id: tasteName.id, name: tasteName.name, icon: tasteName.icon})
                }
                return {
                    status: true,
                    message: 'Tastes',
                    data: {tastes: tasteNameArray}
                }
            }
            return {
                status: false,
                message: 'No Tastes found'
            }
        }
        return {
            status: false,
            message: 'No user found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

//All users for excel sheet
const exportAllUsers = async (req) => {
    try {
        // const users = await db.User.findAll({where: {phone: {[db.Op.not]: ''}}})
        const usersData = await db.sequelize.query(`Select first_name, last_name, phone From users Where phone !='';`, {type: db.QueryTypes.SELECT})
        return {
            status: true,
            message: `All users`,
            data: {all_users: usersData}
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const blockReportedUser = async (req) => {
    try {
        const {f_id} = req.body
        let user = await db.User.findOne({where: {id: f_id}})
        if (user) {
            if (user.blocked) {
                return {
                    status: false,
                    message: 'User already blocked'
                }
            }
            await db.User.update({blocked: true}, {where: {id: f_id}})
            user = await db.User.findOne({where: {id: f_id}})
            user.auth_token = ''
            user.login_token = ''
            user.password = ''
            return {
                status: true,
                message: 'User blocked successfully',
                data: user
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const unBlockUser = async (req) => {
    try {
        const {f_id} = req.body
        let user = await db.User.findOne({where: {id: f_id}})
        if (user) {
            await db.User.update({blocked: false}, {where: {id: f_id}})
            user = await db.User.findOne({where: {id: f_id}})
            user.auth_token = ''
            user.login_token = ''
            user.password = ''
            return {
                status: true,
                message: 'User unblocked successfully',
                data: user
            }
        }
        return {
            status: false,
            message: 'User not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

export {adminLogin, viewStats, userProfileUpdated, updateUser, viewAllUserTaste, exportAllUsers, blockReportedUser, unBlockUser, addProduct}
