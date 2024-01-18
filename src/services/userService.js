import db from '../models/index.js'
import {generateAccessToken, getUserIdFromToken, generateAccessTokenAutoLogin} from '../utilities/authentication.js'
import {sendSms} from './twilioService.js'
import Parse from 'parse/node.js'
import {sendNotification} from '../notification/sendNotification.js'
import {deleteImage, deleteMultipleImage, s3SharpImageUpload} from './aws.js'
import NotificationEnum from '../enums/notification-type-enum.js'
Parse.initialize(process.env.APP_ID, process.env.JS_ID)
Parse.serverURL = process.env.SERVER_URL
import {resetPasswordEmail, verificationCodeEmail} from './emailService.js'

//developed by smart-soft-studios
const registerUser = async (req) => {
    try {
        const {firstName, lastName, email, password, image, social_id, fcm_token, phone} = req.body
        const user = await db.User.findOne({where: {email: {[db.Op.eq]: `${email}`}}})
        if (!user) {
            const verifyCode = await randomCode()
            console.log(verifyCode)
            const bcryptPassword = await hashPassword(password)
            let dataa = image && (await s3SharpImageUpload(image))
            console.log('>>>>>>>>>>>>>>', dataa)
            let _createUser = await db.User.create({firstName: firstName, lastName: lastName, email: email, password: bcryptPassword, image: dataa, social_id: social_id, fcm_token: fcm_token, phone: phone, verification_code: verifyCode})
            if (_createUser) {
                _createUser = await db.User.findOne({where: {id: _createUser.id}})

                // _createUser.verification_code = ''
                // _createUser.password = ''
                const token = await generateAccessToken(_createUser)
                _createUser.auth_token = token
                _createUser.login_token = token
                await db.User.update({auth_token: token, login_token: token}, {where: {id: _createUser.id}})
                //await db.UserNotification.create({ u_id: _createUser.id })
                let filterInfo = await db.User.findOne({where: {id: _createUser.id}, attributes: ['id', 'firstName', 'lastName', 'email', 'auth_token', 'login_token', 'social_id', 'image', 'fcm_token', 'phone']})
                await verificationCodeEmail(verifyCode, email)

                //for phone number
                sendSms(phone, verifyCode)
                return {
                    status: true,
                    message: 'User registered successfully',
                    data: {user: filterInfo}
                }
            }
        } else {
            return {
                status: false,
                message: 'User already registered'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

//developed by smart-soft-studios
const userProfile = async (req) => {
    const u_id = await getUserIdFromToken(req)

    if (u_id) {
        let _profile = await db.User.findOne({where: {id: u_id}})
        return {
            data: {_profile},
            status: true,
            message: `my profile data `
        }
    } else {
        return {
            status: false,
            message: `error `
        }
    }
}

const updateUser = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let {new_profile_image, email} = req.body

        if (email) {
            const userEmailExist = await db.User.findOne({where: {email: email, id: {[db.Op.ne]: u_id}}})
            if (userEmailExist) {
                return {
                    status: false,
                    message: `Email not available`
                }
            }
        }
        const user = await db.User.findOne({where: {id: u_id}})

        if (user) {
            if (!user?.is_verified) {
                return {
                    status: false,
                    message: `User account not verified`
                }
            }

            if (new_profile_image?.length > 4) {
                return {
                    status: false,
                    message: 'Please upload maximum 4 photos'
                }
            }

            let images = []

            if (user?.profile_image?.length && new_profile_image?.length) {
                let removedImages = user?.profile_image?.filter((e) => new_profile_image?.includes(e))
                removedImages?.length ? await deleteMultipleImage(removedImages) : ''
            }

            if (new_profile_image?.length) {
                let profile = []
                for (let i = 0; i < new_profile_image?.length; i++) {
                    const startStr = new_profile_image[i].toString().startsWith('data:image/')
                    if (startStr) {
                        profile.push(await s3SharpImageUpload(new_profile_image[i]))
                    }
                }
                let remainingImages = user?.profile_image?.filter((e) => new_profile_image?.includes(e))
                images = remainingImages?.length ? profile.concat(remainingImages) : profile
            }

            let profile_image = images.length ? images : user?.profile_image

            const update_user = await db.User.update({...req.body, profile_image: profile_image}, {where: {id: user?.id}})

            if (update_user) {
                let updatedUser = await db.User.findOne({where: {id: u_id}})
                updatedUser.password = ''
                return {
                    status: true,
                    message: `Changes saved successfully`,
                    data: {updatedUser: updatedUser}
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

const updateSocialUser = async (req) => {
    try {
        let popup = []
        const {u_id} = req.body
        const user = await db.User.findOne({where: {id: u_id}})
        if (user) {
            const update_user = await db.User.update(
                {
                    is_verified: true
                },
                {where: {id: user.id}}
            )
            if (update_user) {
                const existnotification = await db.UserNotification.findOne({where: {u_id: user.id}})
                if (!existnotification) {
                    await db.UserNotification.create({u_id: user.id})
                }

                return {
                    status: true,
                    message: `User updated successfully`,
                    data: {user: user, popUp: popup}
                }
            }
            return {
                status: false,
                message: `Error updating user`,
                data: ''
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

const autoLogin = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {fcm_token} = req.body
        if (u_id) {
            const user = await db.User.findOne({where: {id: u_id}})
            if (!user?.blocked) {
                const token = await generateAccessTokenAutoLogin(user)
                const updatedToken = await db.User.update({auth_token: token, login_token: token, fcm_token: fcm_token}, {where: {id: u_id}})
                if (updatedToken) {
                    const updatedUser = await db.User.findOne({where: {id: u_id}})
                    updatedUser.password = ''
                    return {
                        status: true,
                        message: 'User auto login successful',
                        data: {user: updatedUser}
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'You are blocked. Please contact admin'
                }
            }
        }
        return {
            status: false,
            message: 'User not verified'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// const loginUser = async (req) => {
//     try {
//         const {email, password} = req.body
//         const user = await db.User.findOne({where: {email: email}})
//         if (user) {
//             let checkPassword = await comparePassword(password, user.password)
//             if (checkPassword) {
//                 if (!user?.blocked) {
//                     await db.User.update({auth_token: ''}, {where: {id: user.id}})
//                     const loginUser = await db.User.findOne({where: {id: user.id}})
//                     const auth_token = await generateAccessToken(loginUser)
//                     const login_token = await generateAccessTokenAutoLogin(loginUser)

//                     let updateUser = null
//                     updateUser = await db.User.update({auth_token: auth_token, login_token: login_token}, {where: {id: user.id}})

//                     return {
//                         status: true,
//                         message: 'User logged in successfully',
//                         data: {user: user}
//                     }
//                 } else {
//                     return {
//                         status: false,
//                         message: 'You are blocked. Please contact admin'
//                     }
//                 }
//             }
//             return {
//                 status: false,
//                 message: 'Wrong password'
//             }
//         } else {
//             return {
//                 status: false,
//                 message: 'user is not found'
//             }
//         }
//     } catch (error) {
//         return {
//             status: false,
//             message: error.message
//         }
//     }
// }

// Function to generate MD5 hash
function generateMD5Hash(data) {
    return crypto.createHash('md5').update(data).digest('hex')
}

// Function to compare hashed passwords
async function comparePassword(inputPassword, storedPassword) {
    return inputPassword === storedPassword
}

const loginUser = async (req) => {
    try {
        const {username, password} = req.body
        console.log('username==>>>>>', username)
        const user = await db.User.findOne({where: {username: username}})
        console.log('user==>>>>>>', user)

        if (user) {
            let checkPassword = await comparePassword(generateMD5Hash(password), user.password)

            if (checkPassword) {
                return {
                    status: true,
                    message: 'User logged in successfully',
                    data: {user: user}
                }
            }
        } else {
            return {
                status: false,
                message: 'User is not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteHouseTalkUser = async (req) => {
    try {
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const socialLogin = async (req) => {
    try {
        const {platform, provider, social_id, lat, lng, fcm_token, email, name} = req.body
        //login case with google
        if (provider === 'google') {
            const userBySocialId = await db.User.findOne({where: {social_id: social_id}})
            // if user already registered with google and now try to login with Google
            if (userBySocialId) {
                if (!userBySocialId?.blocked) {
                    const social_id_user = await socaiLoginUser(userBySocialId, fcm_token, platform)
                    return {
                        status: true,
                        message: 'User auto login successful',
                        data: {user: social_id_user, isNewUser: false}
                    }
                } else {
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            }
            if (platform != 'web') {
                //1st Time Registeration With Google

                const _createUser = await db.User.create({firstName: name, email: email, social_id: social_id})
                if (_createUser) {
                    const user = await db.User.findOne({where: {id: _createUser.id}})
                    const token = await generateAccessToken(user)
                    user.auth_token = token
                    user.login_token = token
                    user.password = ''
                    await db.User.update({auth_token: token, login_token: token, fcm_token: fcm_token, is_verified: false}, {where: {id: _createUser.id}})
                    return {
                        status: true,
                        message: 'User signed up successfully with Google',
                        data: {user: user, isNewUser: true}
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'You can not signup from web. Please install the gamba mobile app and register your account first.'
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        } else if (provider === 'apple') {
            const userBySocialId = await db.User.findOne({where: {social_id: social_id}})
            if (userBySocialId) {
                if (!userBySocialId?.blocked) {
                    const social_id_user = await socaiLoginUser(userBySocialId, fcm_token, platform)
                    return {
                        status: true,
                        message: 'User logged in successfully with Apple',
                        data: {user: social_id_user, isNewUser: false}
                    }
                } else {
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            }
            //regsiter case with apple 1st time
            const _createUser = await db.User.create(req.body)
            if (_createUser) {
                const user = await db.User.findOne({where: {id: _createUser.id}})
                const token = await generateAccessToken(user)
                user.auth_token = token
                user.login_token = token
                await db.User.update({auth_token: token, login_token: token, fcm_token: fcm_token, is_verified: false}, {where: {id: _createUser.id}})
                return {
                    status: true,
                    message: 'User signed up successfully with Apple',
                    data: {user: user, isNewUser: true}
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        } else if (provider === 'fb') {
            const userBySocialId = await db.User.findOne({where: {social_id: social_id}})
            if (userBySocialId) {
                if (!userBySocialId?.blocked) {
                    const social_id_user = await socaiLoginUser(userBySocialId, fcm_token, platform)
                    return {
                        status: true,
                        message: 'User logged in successfully with Facebook',
                        data: {user: social_id_user, isNewUser: false}
                    }
                } else {
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            }
            //regsiter case with facebook 1st time
            const _createUser = await db.User.create(req.body)
            if (_createUser) {
                const user = await db.User.findOne({where: {id: _createUser.id}})
                const token = await generateAccessToken(user)
                user.auth_token = token
                user.login_token = token
                await db.User.update({auth_token: token, login_token: token, fcm_token: fcm_token, is_verified: false}, {where: {id: _createUser.id}})
                return {
                    status: true,
                    message: 'User signed up successfully with Facebook',
                    data: {user: user, isNewUser: true}
                }
            }
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        } else {
            return {
                status: false,
                message: 'Something went wrong. Please try again later.'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const socaiLoginUser = async (userBySocialId, fcm_token, platform) => {
    const token = await generateAccessToken(userBySocialId)
    userBySocialId.profile_image = userBySocialId?.profile_image ? userBySocialId.profile_image : 'gamba.png'
    userBySocialId.auth_token = token
    userBySocialId.login_token = token
    userBySocialId.fcm_token = fcm_token
    if (platform == 'web') {
        await db.User.update({auth_token: token, login_token: token}, {where: {id: userBySocialId.id}})
    } else {
        await db.User.update({auth_token: token, login_token: token, fcm_token: fcm_token, badge_count: 0}, {where: {id: userBySocialId.id}})
    }
    return userBySocialId
}

//delete user from admin panel
const deleteUser = async (req) => {
    try {
        // const u_id = await getUserIdFromToken(req)
        const {userId} = req.query
        let user = await db.User.findOne({where: {id: userId}})
        if (user) {
            const event = await db.Events.findAll({where: {u_id: userId}})
            for (let i = 0; i < event.length; i++) {
                event[i].photos?.length ? await deleteMultipleImage(event[i].photos) : ''
                await db.EventCategory.destroy({where: {event_id: event[i].id}})
                await db.EventParticipents.destroy({where: {event_id: event[i].id}})
            }
            const response = await Promise.all([db.Events.destroy({where: {u_id: userId}}), db.User.destroy({where: {id: userId}})])
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    console.log('NOT DELETED')
                })
            if (!response[5]) {
                return {
                    status: false,
                    message: 'Something went wrong. Please try again later.'
                }
            }
            user.profile_image != 'gamba.png' ? await deleteImage(user.profile_image) : ''

            return {
                status: true,
                message: 'User account has been successfully deleted.'
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

const viewAllUser = async (req) => {
    try {
        const {limit, offset} = await facetStage(req.query.page)
        const users = await db.User.findAll({limit: limit, offset: offset})
        if (users) {
            return {
                status: true,
                message: `All users`,
                data: {all_users: users}
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

// Send Register Code
const sendRegisterCode = async (req) => {
    try {
        const {email, phone} = req.body
        const user = await db.User.findOne({where: {[db.Op.or]: [{email: {[db.Op.eq]: `${email}`}}, {phone: {[db.Op.eq]: `${phone}`}}]}})
        if (user) {
            const code = user.verification_code
            if (email) {
                const sendEmail = verificationCodeEmail(code, email)
                if (sendEmail) {
                    return {
                        status: true,
                        message: 'Verification code sent successfully'
                    }
                }
            } else {
                const sendSmsVal = await sendSms(phone, code)
                if (sendSmsVal) {
                    return {
                        status: true,
                        message: 'Verification code sent successfully'
                    }
                }
            }
            return {
                status: false,
                message: 'Phone and code must be non-empty'
            }
        }
        return {
            status: false,
            message: 'Wrong phone number.'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Send Verification Code
const sendVerificationCode = async (req) => {
    try {
        const {phone, email} = req.body
        const u_id = await getUserIdFromToken(req)
        let user = null
        let parse = false
        let parseError = null
        if (phone.includes('@')) {
            const parse_email = phone.toLowerCase()
            const passwordUpdated = await Parse.User.requestPasswordReset(parse_email)
                .then((res) => {
                    return res
                })
                .catch((error) => {
                    parse = true
                    parseError = error.message
                    return error.message
                })
            if (passwordUpdated) {
                return {
                    status: true,
                    message: `Email sent successfully`
                }
            }
            return {
                status: false,
                message: parseError
            }
        } else {
            user = u_id ? await db.User.findOne({where: {phone: phone, id: u_id}}) : await db.User.findOne({where: {phone: phone}})
            if (user) {
                const code = await randomCode()
                const update_user = await db.User.update({verification_code: code}, {where: {id: user.id}})
                if (update_user) {
                    const sendSmsVal = await sendSms(phone, code)
                    if (sendSmsVal) {
                        return {
                            status: true,
                            messages: 'Verification code sent successfully'
                        }
                    }
                    return {
                        status: false,
                        message: 'Phone and code must be non-empty'
                    }
                }
            }
            return {
                status: false,
                message: 'Phone number not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Verify registration code
const verfyRegisterCode = async (req) => {
    try {
        const {email, verification_code} = req.body
        let popup = []
        const user = await db.User.findOne({where: {email: email}})
        if (user) {
            const verifyCode = await db.User.findOne({where: {email: email, verification_code: verification_code}})
            const alreadyVerified = await db.User.findOne({where: {email: email, is_verified: true}})
            if (alreadyVerified) {
                return {
                    status: false,
                    message: 'User already verified, Please login'
                }
            }
            if (verifyCode) {
                const update_user = await db.User.update({is_verified: true}, {where: {id: user.id}})
                if (update_user) {
                    return {
                        status: true,
                        message: `User verified successfully`,
                        data: {popUp: popup}
                    }
                }
            }
            return {
                status: false,
                message: 'Wrong verification code'
            }
        }
        return {
            status: false,
            message: 'User with this email not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Verify verification code.. for password reset verificaiton
const resetPassword = async (req) => {
    try {
        const {email} = req.body
        const user = await db.User.findOne({where: {email: email}})
        if (user) {
            await resetPasswordEmail(user)
            return {
                status: true,
                message: `Email sent to your email address successfully`
            }
        }
        return {
            status: false,
            message: 'Wrong email address'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// Update password
const updatePassword = async (req) => {
    try {
        const {userId} = req.params
        const {password} = req.body
        const bcryptPassword = await hashPassword(password)
        const user = await db.User.findOne({where: {id: userId}})
        if (user) {
            const update_user = await db.User.update(
                {password: bcryptPassword},
                {
                    where: {
                        id: userId
                    }
                }
            )
            // let randomPassword = await randomCode()
            // const id = user.id
            // const bcryptPassword = await hashPassword(JSON.stringify(randomPassword))
            // const update_user = await db.User.update({ password: bcryptPassword }, { where: { id: id } })
            // await newPasswordEmail(user.email, randomPassword)
            if (update_user) {
                return {
                    status: true,
                    message: `Password changed successfully`
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

const randomCode = async () => {
    // let random = 123456
    // return random
    return Math.floor(100000 + Math.random() * 900000)
}

function containsWhitespace(str) {
    return /\s/.test(str)
}

// search by user name
const searchByName = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let {name, chat} = req.body
        let matchedUsers = []
        if (containsWhitespace(name)) {
            const newName = name.split(' ')
            let fill_name = newName[0]
            matchedUsers = await db.sequelize.query(`select * from users where (fill_name like :fill_name or (home_location = '1' and location like :query)) and id != :id and is_verified = :is_verified`, {replacements: {fill_name: `${fill_name}`, query: `${name}`, id: `${u_id}`, is_verified: true}, type: db.QueryTypes.SELECT})
        } else {
            name = '%' + name + '%'
            matchedUsers = await db.sequelize.query(`select * from users where (user_name like :query or fill_name like :query or (home_location = '1' and location like :query)) and id != :id and is_verified = :is_verified`, {replacements: {query: `${name}`, id: `${u_id}`, is_verified: true}, type: db.QueryTypes.SELECT})
        }
        const users = []
        for (let i = 0; i < matchedUsers.length; i++) {
            if (matchedUsers[i].id != u_id && matchedUsers[i]?.parse_objId == null && chat) {
                let user = await matchUserChatTrue(matchedUsers[i], u_id)
                if (user) {
                    users.push(user)
                }
            } else if (matchedUsers[i].id != u_id && !chat) {
                let user = await matchUserChatTrue(matchedUsers[i], u_id)
                if (user) {
                    users.push(user)
                }
            }
        }
        return {
            status: true,
            message: `Matched users`,
            data: {
                users: users
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const matchUserChatTrue = async (user, id) => {
    let is_blocked = await blockedUser(id, user.id)
    if (!is_blocked) {
        user.auth_token = ''
        user.login_token = ''
        user.password = ''
        return user
    } else {
        return null
    }
}

const getAllNotification = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const user = await db.User.findOne({where: {id: u_id}})
        let notificationArray = await getUserNotificationsArray(u_id)
        let oldNotifications = await getOldNotificatins(u_id, notificationArray, user?.last_viewed)
        let newNotifications = await getNewNotificatins(u_id, notificationArray, user?.last_viewed)
        let allNotifications = newNotifications.concat(oldNotifications)
        await db.User.update({last_viewed: new Date()}, {where: {id: u_id}})
        return {
            status: true,
            message: 'All notifications',
            data: {notifications: allNotifications}
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getUserNotificationsArray = async (u_id) => {
    let notificationArray = []
    const userNotification = await db.UserNotification.findOne({where: {u_id: u_id}})
    if (userNotification) {
        if (userNotification?.circle_add_favotite) {
            notificationArray.push(NotificationEnum.ADD_FAV_RESTAURANT)
        }
        if (userNotification?.like_my_gamba) {
            notificationArray.push(NotificationEnum.LIKE_GAMBA)
        }
        if (userNotification?.comment_my_gamba) {
            notificationArray.push(NotificationEnum.COMMENT_GAMBA)
        }
        if (userNotification?.bookmark_my_gamba) {
            notificationArray.push(NotificationEnum.SAVED_GAMBA)
        }
        if (userNotification?.invite_gamba) {
            notificationArray.push(NotificationEnum.INIVITE)
        }
        if (userNotification?.someone_follow) {
            notificationArray.push(NotificationEnum.FOLLOW)
        }
        if (userNotification?.share_my_gamba) {
            notificationArray.push(NotificationEnum.SHARE)
        }
        if (userNotification?.circle_add_gamba) {
            notificationArray.push(NotificationEnum.ADD_GAMBA)
        }
        if (userNotification?.circle_update_gamba) {
            notificationArray.push(NotificationEnum.UPDATE_GAMBA)
        }
    }
    return notificationArray
}

const getBlockedUsersIds = async (u_id) => {
    let blokedUsersIds = [-1]
    const blockedUsers = await db.BlockUser.findAll({where: {u_id: u_id}}) //what if they blocked me?
    for (let i = 0; i < blockedUsers.length; i++) {
        blokedUsersIds.push(JSON.parse(blockedUsers[i].f_id))
    }

    const blocked_me_users = await db.BlockUser.findAll({where: {f_id: u_id}})
    for (let i = 0; i < blocked_me_users.length; i++) {
        blokedUsersIds.push(JSON.parse(blocked_me_users[i].u_id))
    }

    return blokedUsersIds
}

const getOldNotificatins = async (u_id, notificationArray, last_viewed) => {
    let allNotifications = []
    const ownOldNotifications = await db.FcmNotification.findAll({where: {f_id: u_id, type: {[db.Op.in]: notificationArray}, createdAt: {[db.Op.lt]: new Date(last_viewed), [db.Op.gt]: new Date(new Date(last_viewed) - 24 * 60 * 60 * 1000)}}})
    ownOldNotifications.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1
        if (a.createdAt > b.createdAt) return -1
        return 0
    })
    for (let i = 0; i < ownOldNotifications.length; i++) {
        const data = await modifyUserNotifications(ownOldNotifications[i], true, u_id)
        if (data) {
            allNotifications.push(data)
        }
    }
    return allNotifications
}

const getNewNotificatins = async (u_id, notificationArray, last_viewed) => {
    let allNotifications = []
    const ownNewNotifications = await db.FcmNotification.findAll({where: {f_id: u_id, type: {[db.Op.in]: notificationArray}, createdAt: {[db.Op.lt]: new Date(), [db.Op.gt]: new Date(last_viewed)}}})
    ownNewNotifications.sort((a, b) => {
        if (a.createdAt < b.createdAt) return 1
        if (a.createdAt > b.createdAt) return -1
        return 0
    })
    for (let i = 0; i < ownNewNotifications.length; i++) {
        const data = await modifyUserNotifications(ownNewNotifications[i], false, u_id)
        if (data) {
            allNotifications.push(data)
        }
    }
    return allNotifications
}

const modifyUserNotifications = async (notifications, is_read, u_id) => {
    const user = await db.User.findOne({where: {id: notifications.u_id}})
    let is_blocked = await blockedUser(u_id, notifications.u_id)
    let newMessage = u_id == JSON.parse(notifications.f_id) ? await modifyMessage(notifications) : notifications.message
    if (user && !is_blocked) {
        let data = {
            name: user.first_name + ' ' + user.last_name,
            image: user.profile_image,
            message: newMessage,
            u_id: notifications.u_id,
            r_id: notifications.r_id,
            r_title: notifications.r_title,
            b_id: notifications.b_id,
            type: notifications.type,
            time: notifications.createdAt,
            is_read: is_read
        }
        return data
    } else {
        return null
    }
}

const modifyMessage = async (notification) => {
    if (notification.type == NotificationEnum.LIKE_GAMBA) {
        let message = `liked your prifile`
        return message
    } else if (notification.type == NotificationEnum.COMMENT_GAMBA) {
        let message = `commented on your prifile`
        return message
    } else if (notification.type == NotificationEnum.SAVED_GAMBA) {
        let message = `saved your prifile`
        return message
    } else if (notification.type == NotificationEnum.SHARE) {
        let message = `shared your prifile`
        return message
    } else if (notification.type == NotificationEnum.FOLLOW) {
        let message = `is now following you`
        return message
    } else {
        return notification.message
    }
}

const sendChatFcm = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let {users, text} = req.body
        users = JSON.parse(users)
        const sender = await db.User.findOne({where: {id: u_id}})
        for (let index = 0; index < users.length; index++) {
            let receieverId = users[index].replace('G', '')
            const reciver = await db.User.findOne({where: {id: receieverId}})
            let is_blocked = await blockedUser(u_id, reciver?.id)
            if (reciver?.fcm_token && !is_blocked) {
                let message = {
                    token: reciver?.fcm_token,
                    notification: {
                        title: `${sender.first_name} ${sender.last_name} sent you a message`,
                        body: text
                    },
                    data: {u_id: JSON.stringify(u_id), f_id: users[index], type: 'chat'},
                    apns: {
                        payload: {
                            aps: {
                                badge: reciver?.badge_count + 1
                            }
                        }
                    }
                }
                await db.User.update({badge_count: reciver?.badge_count + 1}, {where: {id: reciver.id}})
                sendNotification(message)
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteUserAllData = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let user = await db.User.findOne({where: {id: u_id}})
        if (user) {
            const event = await db.Events.findAll({where: {u_id: u_id}})
            for (let i = 0; i < event.length; i++) {
                event[i].photos?.length ? await deleteMultipleImage(event[i].photos) : ''
                await db.EventCategory.destroy({where: {event_id: event[i].id}})
                await db.EventParticipents.destroy({where: {event_id: event[i].id}})
            }
            const response = await Promise.all([db.Events.destroy({where: {u_id: u_id}}), db.User.destroy({where: {id: u_id}})])
                .then((res) => {
                    return res
                })
                .catch((err) => {
                    console.log('NOT DELETED')
                })
            user.profile_image?.length ? await deleteMultipleImage(user.profile_image) : await deleteImage(user.profile_image)

            if (!response[5]) {
                return {
                    status: false,
                    message: 'Something went wrong. Please try again later.'
                }
            }
            return {
                status: true,
                message: 'Your account has been successfully deleted.'
            }
        }
        return {
            status: false,
            message: 'User account not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const facetStage = async (pageNumber) => {
    const limit = 15 // set limit per page
    const page = pageNumber ? parseInt(pageNumber) : 1 // get page number from user
    const offset = page ? (page - 1) * limit : 0 // number of page multiply py limit
    return {limit, offset}
}

const autoCreate = async () => {
    const admin = await db.Admin.findOne({where: {email: 'admin@hotelmanagment.com'}})
    if (!admin) {
        await db.Admin.create({email: 'admin@hotelmanagment.com', password: await hashPassword('admin')})
    }
}

const blockedUser = async (u_id, f_id) => {
    const is_blocked_admin = await db.User.findOne({where: {id: f_id, blocked: true}})
    const user = await db.BlockUser.findOne({where: {u_id: u_id, f_id: f_id}})
    const is_blocked_me = await db.BlockUser.findOne({where: {u_id: f_id, f_id: u_id}})
    if (is_blocked_admin) {
        return true
    } else if (is_blocked_me) {
        return true
    } else if (user) {
        return true
    } else {
        return false
    }
}

const getUserById = async (req) => {
    try {
        const {id} = await req.query
        let user = await db.User.findOne({where: {id: id}})
        if (user) {
            user.password = ''
            return {
                status: true,
                message: `User data`,
                data: user
            }
        }
        return {
            status: false,
            message: `User not found`
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const userPost = async (req) => {
    //developed by smart-soft-studios
    const {description, image} = req.body
    const u_id = await getUserIdFromToken(req)
    //let data = await s3SharpImageUpload(images)

    let productImage = []

    if (image?.length) {
        for (let i = 0; i < image?.length; i++) {
            const startStr = image[i].toString().startsWith('data:image/')
            if (startStr) {
                productImage.push(await s3SharpImageUpload(image[i]))
            }
        }

        // let remainingImages = user?.profile_image?.filter((e) => new_profile_image?.includes(e))
        // images = remainingImages?.length ? profile.concat(remainingImages) : profile
    }

    let _createPoste = await db.UserPostes.create({u_id: u_id, description: description, image: productImage})

    // let info=await db.User.findAll({

    //     include:[{
    //         model:db.UserPostes,
    //         as:"userPostes"
    //     }]
    // })
    // console.log("data is ------------>>>>>>>>>>>",info) //info[0].dataValues.userPostes  info[1].dataValues.userPostes[0]
    return {
        data: {_createPoste},
        status: true,
        message: `User poste created `
    }
}
const userUpdatePost = async (req) => {
    //developed by smart-soft-studios
    console.log('enter in user update poste-------->>>>')

    const {posteId} = req.params
    const {description, image, u_id} = req.body
    console.log('posteeeeee-------->>>', posteId)

    const post = await db.UserPostes.findOne({where: {id: posteId, u_id: u_id}})
    console.log('------------------', post)

    let data = await s3SharpImageUpload(image)
    if (post) {
        const update_post = await db.UserPostes.update(
            {description: description, images: data},
            {
                where: {
                    id: posteId,
                    u_id: u_id
                }
            }
        )
        console.log('updated poste------>', update_post)
        return {
            data: {update_post},
            status: true,
            message: `poste is updated `
        }
    }
}

const userdeletePost = async (req) => {
    //developed by smart-soft-studios
    console.log('enter in user delete poste-------->>>>')

    const {posteId} = req.params
    const {description, image, u_id} = req.body
    //const u_id = await getUserIdFromToken(req)
    console.log('posteeeeee-------->>>', posteId)

    const post = await db.UserPostes.findOne({where: {id: posteId, u_id: u_id}})
    console.log('------------------', post)

    if (post) {
        const delete_post = await db.UserPostes.destroy({
            where: {
                id: posteId,
                u_id: u_id
            }
        })
        console.log('updated poste------>', delete_post)
        return {
            data: {delete_post},
            status: true,
            message: `poste is deleted `
        }
    } else {
        return {
            status: false,
            message: `error `
        }
    }
}

const userAllPost = async (req) => {
    //developed by smart-soft-studios
    console.log('enter user all post services-------->>>>')

    // let info=await db.User.findAll({

    //          include:[{
    //             model:db.UserEvents,
    //              as:"userEvents"
    //          }]
    //      })
    //      console.log("data is ------------>>>>>>>>>>>",info)

    const u_id = await getUserIdFromToken(req)
    let info = await db.User.findAll({
        include: [
            {
                model: db.UserPostes,
                as: 'userPostes',
                include: [
                    {
                        association: 'userLike'
                    },
                    {association: 'userComment'}
                ]
            }
        ],
        where: {id: u_id}
    })
    console.log('data is ------------>>>>>>>>>>>', info)

    let _allPost = await db.UserPostes.findAll({where: {u_id: u_id}})

    console.log('>>>>>>>>>>>>>', u_id)
    return {
        data: {info},
        status: true,
        message: `all post `
    }
}

const AllPost = async (req) => {
    //developed by smart-soft-studios
    console.log('enter user all post  of user services-------->>>>')

    const u_id = await getUserIdFromToken(req)
    let info = await db.User.findAll({
        include: [
            {
                model: db.UserPostes,
                as: 'userPostes',
                include: [
                    {
                        association: 'userLike'
                    },
                    {association: 'userComment'}
                ]
            }
        ]
    })

    // const info = await db.User.findAll({
    //     include: [
    //       {
    //         model: db.UserPostes,
    //         as: "userPostes",
    //         include: [
    //           {
    //             association: "userLike",
    //             attributes: [
    //               [
    //                 db.sequelize.fn("COUNT", sequelize.col("userPostes.userLike.id")),
    //                 "likeCount",
    //               ],
    //             ],
    //           },
    //           {
    //             association: "userComment",
    //             attributes: [
    //               [
    //                 db.sequelize.fn(
    //                   "COUNT",
    //                   db.sequelize.col("userPostes.userComment.id")
    //                 ),
    //                 "commentCount",
    //               ],
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //     //attributes: ["id", "name", "email"], // include only necessary user attributes
    //   });

    // let info = await db.User.findAll({
    //     include: [
    //       {
    //         model: db.UserPostes,
    //         as: "userPostes",
    //         include: [
    //           {
    //             model: db.userLikes,
    //             as: "userLike",
    //             attributes: [[db.sequelize.fn("COUNT", db.sequelize.col("userLike.id")), "likeCount"]],
    //           },
    //           {
    //             model: db.userComments,
    //             as: "userComment",
    //             attributes: [[db.sequelize.fn("COUNT", db.sequelize.col("userComment.id")), "commentCount"]],
    //           },
    //         ],
    //       },
    //     ],
    //   });
    let _allPost = await db.UserPostes.findAll({where: {u_id: u_id}})

    return {
        data: {info},
        status: true,
        message: `all post `
    }
}

const userLike = async (req) => {
    //developed by smart-soft-studios
    const {u_id, post_id} = req.body

    // let info=await db.User.findAll({

    //          include:[{
    //             model:db.UserEvents,
    //              as:"userEvents"
    //          }]
    //      })
    //      console.log("data is ------------>>>>>>>>>>>",info)

    let _createLike = await db.userLikes.create({u_id: u_id, Post_id: post_id})

    return {
        data: {_createLike},
        status: true,
        message: `like  is added `
    }
}

const userComment = async (req) => {
    //developed by smart-soft-studios
    console.log('enter user comments services-------->>>>')
    const {u_id, post_id, comment} = req.body
    // let info=await db.User.findAll({

    //          include:[{
    //             model:db.UserEvents,
    //              as:"userEvents"
    //          }]
    //      })
    //      console.log("data is ------------>>>>>>>>>>>",info)

    let _createComment = await db.userComments.create({u_id: u_id, Post_id: post_id, comment: comment})

    return {
        data: {_createComment},
        status: true,
        message: `comment  is added `
    }
}

const userProductGood = async (req) => {
    //developed by smart-soft-studios
    console.log('enter-------->>>>')
    const {name, price, is_donation, is_trade, images, u_id, is_favorite, quantity, is_organic, category_id} = req.body

    // let info=await db.User.findAll({

    //          include:[{
    //             model:db.userProductGood,
    //              as:"userProductGood"
    //          }]
    //      })

    let productImage = []

    if (images?.length) {
        for (let i = 0; i < images?.length; i++) {
            const startStr = images[i].toString().startsWith('data:image/')
            if (startStr) {
                productImage.push(await s3SharpImageUpload(images[i]))
            }
        }

        // let remainingImages = user?.profile_image?.filter((e) => new_profile_image?.includes(e))
        // images = remainingImages?.length ? profile.concat(remainingImages) : profile
    }

    //    let data= await s3SharpImageUpload(image)

    console.log('image array is ---->', productImage)
    let _createPoste = await db.userProductGood.create({name: name, price: price, is_donation: is_donation, is_trade: is_trade, u_id: u_id, images: productImage, is_favorite: is_favorite, quantity: quantity, is_organic: is_organic, category_id: category_id})

    return {
        data: {_createPoste},
        status: true,
        message: `good poste created `
    }
}

const userUpdateProductGood = async (req) => {
    //developed by smart-soft-studios
    console.log('enter user update good -------->>>>')
    const {product_good_id} = req.params
    const {name, price, is_donation, is_trade, images, u_id} = req.body
    //console.log('product id ------>',price)
    // let info=await db.User.findAll({

    //          include:[{
    //             model:db.userProductGood,
    //              as:"userProductGood"
    //          }]
    //      })
    //      console.log("data is ------------>>>>>>>>>>>",info)

    //console.log('name is----------->>>>>>>>>>',image)

    const product = await db.userProductGood.findOne({where: {id: product_good_id, u_id: u_id}})
    if (product) {
        let productImage = []

        if (images?.length) {
            for (let i = 0; i < images?.length; i++) {
                const startStr = images[i].toString().startsWith('data:image/')
                if (startStr) {
                    productImage.push(await s3SharpImageUpload(images[i]))
                }
            }

            // let remainingImages = user?.profile_image?.filter((e) => new_profile_image?.includes(e))
            // images = remainingImages?.length ? profile.concat(remainingImages) : profile
        }

        console.log('image array is ---->', productImage)
        let _updateProduct = await db.userProductGood.update(
            {name: name, price: price, is_donation: is_donation, is_trade: is_trade, u_id: u_id, images: productImage},
            {
                where: {
                    id: product_good_id,
                    u_id: u_id
                }
            }
        )

        if (_updateProduct) {
            return {
                data: {_updateProduct},
                status: true,
                message: `good product updated created `
            }
        } else {
            return {
                status: false,
                message: `error`
            }
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const userDeleteProductGood = async (req) => {
    //developed by smart-soft-studios
    console.log('enter user delete product services-------->>>>')
    const {product_good_id} = req.params
    //const{u_id}=req.body
    const u_id = await getUserIdFromToken(req)
    console.log('pt-------->', product_good_id)

    const product = await db.userProductGood.findOne({where: {id: product_good_id, u_id: u_id}})

    if (product) {
        let _delete_product = await db.userProductGood.destroy({where: {id: product_good_id, u_id: u_id}})

        return {
            data: {_delete_product},
            status: true,
            message: `product is delete `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const getAllProductGood = async (req) => {
    //developed by smart-soft-studios
    console.log('enter all  product services-------->>>>')

    const product = await db.userProductGood.findAll({})
    let info = await db.userProductGood.findAll({
        include: [
            {
                model: db.productCategorys,
                as: 'userCategory'
            },
            {model: db.productChemical, as: 'chemical'}
        ]
    })

    if (info) {
        return {
            data: {info},
            status: true,
            message: `all product`
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const addCategory = async (req) => {
    //developed by smart-soft-studios
    console.log('enter add category  services-------->>>>')
    const {category_title} = req.body
    let _createCategoiry = await db.productCategorys.create({category_title: category_title})

    return {
        data: {_createCategoiry},
        status: true,
        message: `event  created `
    }
}

const soldProductGood = async (req) => {
    //developed by smart-soft-studios
    console.log('enter sold product services-------->>>>')

    const {product_id, u_id, quantity, date} = req.body

    let _soldProduct = await db.userSoldProductGood.create({product_id: product_id, u_id: u_id, quantity: quantity, date: date})
    let product = await db.userProductGood.findOne({where: {id: product_id}})
    let total_quantity = product.quantity
    let new_quantity = total_quantity - quantity
    console.log('remaing quantity is ', new_quantity)

    //let new_product=await db.userProductGood.update({quantity:new_quantity},{where:{id:product_id}})

    if (_soldProduct) {
        //console.log('--------value>',_soldProduct)

        //_soldProduct.total_quantity=prev_quantity;

        return {
            data: {..._soldProduct.dataValues, total_quantity},
            status: true,
            message: `remaining quantity is   ${new_quantity} and total quantity is ${total_quantity}`
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const addChemicalProductGood = async (req) => {
    //developed by smart-soft-studios
    console.log('enter add chemical product services-------->>>>')

    const {product_id, chemical_id} = req.body

    let _addChemical = await db.productChemical.create({product_id: product_id, chemical_id: chemical_id})

    // let product=await db.userProductGood.findOne({where:{  id:product_id   }})
    // let prev_quantity=product.quantity;
    // let new_quantity=prev_quantity-quantity;
    // console.log('remaing quantity is ',new_quantity)

    //let new_product=await db.userProductGood.update({quantity:new_quantity},{where:{id:product_id}})

    if (_addChemical) {
        //console.log('--------value>',_soldProduct)

        //_soldProduct.total_quantity=prev_quantity;

        return {
            data: {..._addChemical.dataValues},
            status: true,
            message: `chemical is added to product good `
        }
    } else {
        return {
            status: false,
            message: `error`
        }
    }
}

const userEvent = async (req) => {
    //developed by smart-soft-studios
    console.log('enter user event services-------->>>>')
    const {price, location, start_date, end_date, summary, u_id} = req.body

    // let info=await db.User.findAll({

    //          include:[{
    //             model:db.UserEvents,
    //              as:"userEvents"
    //          }]
    //      })
    //      console.log("data is ------------>>>>>>>>>>>",info)

    console.log('price====>>>>>', price)

    let _createPoste = await db.UserEvents.create({price: price, location: location, summary: summary, start_date: start_date, u_id: u_id, end_date: end_date})

    return {
        data: {_createPoste},
        status: true,
        message: `event  created `
    }
}

export {getBlockedUsersIds, addChemicalProductGood, soldProductGood, addCategory, getAllProductGood, AllPost, userComment, userLike, userProfile, userAllPost, userDeleteProductGood, userUpdateProductGood, userdeletePost, userUpdatePost, userEvent, userProductGood, userPost, autoCreate, facetStage, deleteUserAllData, getUserNotificationsArray, getNewNotificatins, sendChatFcm, getAllNotification, registerUser, updateUser, autoLogin, loginUser, socialLogin, deleteUser, viewAllUser, sendRegisterCode, sendVerificationCode, verfyRegisterCode, resetPassword, updatePassword, searchByName, updateSocialUser, blockedUser, getUserById}
