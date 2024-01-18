import db from '../models/index.js'
import {comparePassword, generateMD5Hash} from '../utilities/passwordUtils.js'
import {generateAccessToken, generateAccessTokenAutoLogin, generateAccessTokenForPasswordRest, getUserIdFromResetLink, getUserIdFromToken, verifyAuthToken, verifyResetToken} from '../utilities/authentication.js'
import {deleteAudio, deleteImage, deleteMultipleImage, getPicturesByFolder, s3AudioUpload, s3ImageUpload, s3ImageUploadInFolder, s3SharpImageUpload} from './aws.js'
import Zencoder from 'zencoder'
import {getClientIP, getIpAddress} from '../utilities/message.js'
import {adminResetUserPassword, recievedEmailToClient, resetPasswordEmail, sendEmailToFreind, sendPromotions, sendPropertyIdEmail, sendPropertyIdEmailAgent} from './emailService.js'
import {sendPromotionsSms, sendSms, sendSmsAgent, sendSmsFreind} from './twilioService.js'
import crypto from 'crypto'
import Sequelize from 'sequelize'
const Op = Sequelize.Op
import * as geolib from "geolib";

const addHouseTalkUser = async (req) => {
    try {
        const {firstname, lastname, username, company, phone, address, city, state, zip, singleAgent, teamAgent, brokerAgent, gender, age, location, country, aboutme, email, password} = req.body
        const user = await db.member.findOne({where: {email: {[db.Op.eq]: `${email}`}}})
        const findHouseTalkUser = await db.member.findAll({where: {type: 'user'}})
        if (!user) {
            const findUserName = await db.member.findOne({where: {username: {[db.Op.eq]: `${username}`}}})
            if (!findUserName) {
                let hashPassword = generateMD5Hash(password)
                let _createUser = await db.member.create({username: username, firstname: firstname, lastname: lastname, company: company, phone: phone, password: hashPassword, address: address, city: city, state: state, zip: zip, package: singleAgent ? singleAgent : teamAgent ? teamAgent : brokerAgent ? brokerAgent : 0, gender: gender, age: age, location: location, country: country, aboutme: aboutme, email: email, smsmessagecount: 50})
                if (_createUser) {
                    _createUser = await db.member.findOne({where: {id: _createUser.id}})
                    const token = await generateAccessToken(_createUser)
                    _createUser.auth_token = token
                    _createUser.login_token = token
                    await db.member.update({auth_token: token, login_token: token}, {where: {id: _createUser.id}})
                    return {
                        status: true,
                        message: 'User registered successfully',
                        data: findHouseTalkUser
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'Username Already used'
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

const deleteHouseTalkUser = async (req) => {
    try {
        const { userId } = req.body;
        let user = await db.member.findOne({ where: { id: userId } });
        if (user) {
            const deletePodcasting = await db.podcasting.findAll({ where: { poster: userId } });
           if (deletePodcasting.length===0) {
            await db.member.destroy({where:{id:userId}})
            return {
                status: true,
                message: "User Deleted Successfully",
                
            };
           }
            if (deletePodcasting && deletePodcasting.length > 0) {
                for (let index = 0; index < deletePodcasting.length; index++) {
                    const podcast = deletePodcasting[index];
                    console.log("element",podcast.id);
                    await deleteAudio(podcast.mediaurl);
                    await deleteImage(podcast.image);
                    if (podcast.prerollpod) {
                    await deleteAudio(podcast.prerollpod);
                    }
                    if (podcast.postrollpod) {
                    await deleteAudio(podcast.postrollpod);
                    }
                    const images=await getPicturesByFolder(`${userId}_${podcast.id}`)
                    if (images) {
                     await deleteMultipleImage(images)
                             }
                    const deleteData=  await db.podcasting.destroy({ where: { poster: userId } });
                     if (deleteData) {
                     await db.member.destroy({where:{id:userId}})
                            }
                    
                }
                return {
                    status: true,
                    message: "User Deleted Successfully",
                    
                };
                
            } else {
                return {
                    status: false,
                    message: "Property Not Found"
                };
            }
           

        } else {
            return {
                success: false,
                message: "User Not Found"
            };
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

const memberProfile = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        if (u_id) {
            let _profile = await db.member.findOne({where: {id: u_id}})
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
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const editMember = async (req) => {
    try {
        const {username, lastname, firstname} = req.body
        const memberData = await db.member.update(
            {
                lastname: lastname,
                firstname: firstname
            },
            {
                where: {
                    username: username
                }
            }
        )
        if (memberData) {
            return {
                status: true,
                message: 'status',
                data: memberData
            }
        }
        return {
            status: false,
            message: 'Wrong'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const loginUser = async (req) => {
    try {
        const {username, password} = req.body

        const user = await db.member.findOne({where: {username: username}})

        if (user) {
            console.log('user===>>>', user.banned)
            let checkPassword = await comparePassword(generateMD5Hash(password), user.password)
            if (checkPassword) {
                if (!user?.banned) {
                    // await db.member.update({auth_token: ''}, {where: {id: user.id}})
                    const loginUser = await db.member.findOne({where: {id: user.id}})
                    const auth_token = await generateAccessToken(loginUser)
                    const login_token = await generateAccessTokenAutoLogin(loginUser)
                    user.auth_token = auth_token
                    user.login_token = login_token
                    await user.save()
                    return {
                        status: true,
                        message: 'User logged in successfully',
                        data: user
                    }
                } else {
                    console.log(2)
                    return {
                        status: false,
                        message: 'You are blocked. Please contact admin'
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'Wrong password'
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

const updateMember = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        let {firstname, company, password, address, city, email, phone, state, zip, country, lastname, youtube_welcome_link, facebookPixel, ask_for_email, ask_for_tel, ask_for_facebook, ask_for_gmail, show_welcome_video, email_notifications_on_visitor_activity} = req.body

        const user = await db.member.findOne({where: {id: u_id}})

        if (user) {
            if (!user?.userapproved) {
                return {
                    status: false,
                    message: `User account not verified`
                }
            }

            let hashPassword = user.password
            if (password) {
                hashPassword = generateMD5Hash(password)
            }

            const update_user = await db.member.update({firstname, company, phone: phone, state: state, password: hashPassword, address, city, email, zip, country, lastname, youtube_welcome_link, facebook_pixel: facebookPixel, ask_for_email: ask_for_email, ask_for_tel: ask_for_tel, ask_for_facebook: ask_for_facebook, ask_for_gmail: ask_for_gmail, show_welcome_video: show_welcome_video, email_notifications_on_visitor_activity: email_notifications_on_visitor_activity}, {where: {id: user?.id}})

            if (update_user) {
                let updatedUser = await db.member.findOne({where: {id: u_id}})

                return {
                    status: true,
                    message: `Changes saved successfully`,
                    data: {updatedUser}
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

const manageMemberHomaPage = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let {templatename, podbannerimage, banner_url} = req.body
        if (u_id) {
            const bannerImage = await s3SharpImageUpload(podbannerimage)
            const createBanner = await db.frontendtemplate.create({templateuserid: u_id, templatename: templatename, headerbanner: bannerImage, banner_url: banner_url, templageslogantype: 0, templatemodule: 'web', templatestatus: 0})
            const allBanner = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
            if (createBanner) {
                return {
                    status: true,
                    message: `Banner added Successfully`,
                    data: allBanner
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

const activeHomePageBanner = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let {templateid} = req.body

        const userTemplates = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
        const previousActiveTemplate = userTemplates.find((template) => template.templatestatus === 1)

        if (previousActiveTemplate) {
            await previousActiveTemplate.update({templatestatus: 0})
        }

        const newTemplate = userTemplates.find((template) => template.templateid === templateid)
        if (newTemplate) {
            await newTemplate.update({templatestatus: 1})
            return {
                status: true,
                message: 'Template status active successfully',
                data: userTemplates
            }
        } else {
            return {
                status: false,
                message: 'Template not found'
            }
        }
    } catch (error) {
        console.log('error==>>>>>>', error)
        return {
            status: false,
            message: error.message
        }
    }
}

const updateManageMemberHomaPage = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        let {templatename, podbannerimage, banner_url} = req.body
        const user = await db.frontendtemplate.findOne({where: {templateuserid: u_id}})
        if (user) {
            const bannerImage = await s3ImageUpload(podbannerimage)
            const createBanner = await db.frontendtemplate.create({templateuserid: u_id, templatename: templatename, headerbanner: bannerImage, banner_url: banner_url, templageslogantype: 0, templatemodule: 'web', templatestatus: 0}, {where: {id: user?.id}})

            if (createBanner) {
                return {
                    status: true,
                    message: `Banner added Successfully`
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

const getAllHomePageBanner = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const userTemplates = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
        const reverseTemplate = await userTemplates.reverse()
        if (userTemplates) {
            return {
                status: true,
                message: 'Template found successfully',
                data: reverseTemplate
            }
        }
        return {
            status: false,
            message: 'Template not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteHomePageBanner = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {templateid} = req.body
        const userTemplates = await db.frontendtemplate.findOne({where: {templateid: templateid}})
        const deleteImages = await deleteImage(userTemplates.headerbanner)

        console.log('deleteImage===>>>>>>>', deleteImages)
        if (userTemplates) {
            const templateData = await db.frontendtemplate.destroy({
                where: {
                    templateid: templateid
                }
            })

            if (templateData) {
                const userTemplateData = await db.frontendtemplate.findAll({
                    where: {
                        templateuserid: u_id
                    }
                })
                return {
                    status: true,
                    message: 'tempate deleted successfully',
                    data: userTemplateData
                }
            }
            return {
                status: false,
                message: 'unable to delete'
            }
        } else {
            return {
                status: false,
                message: 'user id not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const editBanner = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const editTemplate = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
        let {templatename, podbannerimage, banner_url, saveAsNewTemplate, templateid, isOldImage} = req.body
        if (!saveAsNewTemplate) {
            const findTemplateId = editTemplate.find((value) => {
                return value.templateid == templateid
            })

            if (findTemplateId) {
                if (!isOldImage) {
                    const getTemplateImage = await db.frontendtemplate.findAll({where: {headerbanner: podbannerimage}})
                    console.log('getTemplateImage==>>>>>', getTemplateImage)
                    if (getTemplateImage.length > 1) {
                    } else {
                        await deleteImage(findTemplateId.headerbanner)
                    }

                    const bannerImage = await s3ImageUpload(podbannerimage)
                    const update_template = await db.frontendtemplate.update(
                        {
                            templatename: templatename,
                            headerbanner: bannerImage,
                            banner_url: banner_url
                        },
                        {where: {templateid: templateid, templateuserid: u_id}}
                    )
                    const updatedUser = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
                    return {
                        status: true,
                        message: 'Banner Updated successfully',
                        data: updatedUser
                    }
                } else {
                    const update_template = await db.frontendtemplate.update(
                        {
                            templatename: templatename,
                            headerbanner: podbannerimage,
                            banner_url: banner_url
                        },
                        {where: {templateid: templateid, templateuserid: u_id}}
                    )
                    const updatedUser = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
                    return {
                        status: true,
                        message: 'Banner Updated successfully',
                        data: updatedUser
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'No template found to edit'
                }
            }
        } else {
            if (!isOldImage) {
                const bannerImage = await s3ImageUpload(podbannerimage)

                const newTemplate = await db.frontendtemplate.create({
                    templatename: templatename,
                    headerbanner: bannerImage,
                    banner_url: banner_url,
                    templateuserid: u_id,
                    templatemodule: 'web'
                })
                const updatedUser = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
                return {
                    status: true,
                    message: 'Banner Uploaded successfully',
                    data: updatedUser
                }
            } else {
                const newTemplate = await db.frontendtemplate.create({
                    templatename: templatename,
                    headerbanner: podbannerimage,
                    banner_url: banner_url,
                    templateuserid: u_id,
                    templatemodule: 'web'
                })
                const updatedUser = await db.frontendtemplate.findAll({where: {templateuserid: u_id}})
                return {
                    status: true,
                    message: 'Banner Uploaded successfully',
                    data: updatedUser
                }
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const addHouseTalk = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {files, title, address, addresslat, addresslng, addresslatlndate, facebook_bot_link, youtube_virtual_tour_id, ask_for_email_tel_feb, showWelcomeVideo, recieve_email_notifications, description, tags, prerollpod, postrollpod, mediaurl, url, facebookPixel, facebook, twitter, linkedin, whatsapp, mailto} = req.body

        if (u_id) {
            const findAllHousTalk = await db.podcasting.findAll({
                where: {
                    poster: u_id
                }
            })
            const parentUser = await db.member.findOne({where: {id: u_id}})
            if (parentUser.type==="user") {
                if (findAllHousTalk.length<=99) {

                    const findData = await db.podcasting.findAll({poster: u_id})
                    const uploadAudio = await s3AudioUpload(mediaurl)
                    const video_shortcode = await generateCode(11)
                    const shortfilename = 'oht_' + (await getFormattedDate()) + '_' + video_shortcode
        
                    const zencoderClient = new Zencoder(process.env.ZEN_CODER_API)
                    const inputUrl = `${process.env.AWS_S3_LINK}${uploadAudio}`
                    const encodingParams = {
                        input: inputUrl,
                        outputs: {
                            url: `s3://ourhousetalks-bucket/${shortfilename}.mp3`,
                            public: 1
                        }
                    }
                    zencoderClient.Job.create(encodingParams, async (err, data) => {
                        if (err) {
                            console.error('Error creating Zencoder job:', err)
                        } else {
                            console.log('Zencoder job created:', data)
                            // await deleteAudio(`${process.env.AWS_S3_LINK}${result}`)
                        }
                    })
        
                    const zenencoderUrl = encodingParams.outputs.url.split('/').pop()
                    console.log('zenencoderUrl', zenencoderUrl)
                    const addHousTalk = await db.podcasting.create(
                        {podcount: 1, poster: u_id, title: title, address: address, addresslat: addresslat, addresslng: addresslng, addresslatlndate: addresslatlndate, facebook_bot_link: facebook_bot_link, youtube_virtual_tour_id: youtube_virtual_tour_id, ask_for_email_tel_fb: ask_for_email_tel_feb, receive_email_notifications: recieve_email_notifications, mediaurl: zenencoderUrl, description: description, tags: tags, prerollpod: prerollpod, postrollpod: postrollpod, url: url, show_welcome_video: showWelcomeVideo ? 'checked' : null, facebook_pixel: facebookPixel, facebook: facebook, twitter: twitter, linkedin: linkedin, whatsapp: whatsapp, mailto: mailto},
                        {
                            returning: ['id']
                        }
                    )
        
                   
                    const propertyId = addHousTalk.id
                    const folderName = `${u_id}_${propertyId}`
        
                    const images = await s3ImageUploadInFolder(files, folderName)
                    const update_data = await db.podcasting.findOne({id: addHousTalk.id})
                    return {
                        status: true,
                        message: 'HouseTalk Added Successfully',
                        data: update_data,
                        data: {singleData:update_data,allData:findAllHousTalk.length},
                    }
                }else{
                    return {
                        status: false,
                        message: 'You Reached your maximum limit you cannot upload more agents please contact with admin'
                    }
                }
            }else if (parentUser.type==="subuser") {
                if (findAllHousTalk.length<=49) {
                    const findData = await db.podcasting.findAll({poster: u_id})
                    const uploadAudio = await s3AudioUpload(mediaurl)
                    const video_shortcode = await generateCode(11)
                    const shortfilename = 'oht_' + (await getFormattedDate()) + '_' + video_shortcode
        
                    const zencoderClient = new Zencoder(process.env.ZEN_CODER_API)
                    const inputUrl = `${process.env.AWS_S3_LINK}${uploadAudio}`
                    const encodingParams = {
                        input: inputUrl,
                        outputs: {
                            url: `s3://housetalk-media/${shortfilename}.mp3`,
                            public: 1
                        }
                    }
                    zencoderClient.Job.create(encodingParams, async (err, data) => {
                        if (err) {
                            console.error('Error creating Zencoder job:', err)
                        } else {
                            console.log('Zencoder job created:', data)
                            // await deleteAudio(`${process.env.AWS_S3_LINK}${result}`)
                        }
                    })
        
                    const zenencoderUrl = encodingParams.outputs.url.split('/').pop()
                    console.log('zenencoderUrl', zenencoderUrl)
                    const addHousTalk = await db.podcasting.create(
                        {podcount: 1, poster: u_id, title: title, address: address, addresslat: addresslat, addresslng: addresslng, addresslatlndate: addresslatlndate, facebook_bot_link: facebook_bot_link, youtube_virtual_tour_id: youtube_virtual_tour_id, ask_for_email_tel_fb: ask_for_email_tel_feb, receive_email_notifications: recieve_email_notifications, mediaurl: zenencoderUrl, description: description, tags: tags, prerollpod: prerollpod, postrollpod: postrollpod, url: url, show_welcome_video: showWelcomeVideo ? 'checked' : null, facebook_pixel: facebookPixel, facebook: facebook, twitter: twitter, linkedin: linkedin, whatsapp: whatsapp, mailto: mailto},
                        {
                            returning: ['id']
                        }
                    )
        
                   
                    const propertyId = addHousTalk.id
                    const folderName = `${u_id}_${propertyId}`
        
                    const images = await s3ImageUploadInFolder(files, folderName)
                    const update_data = await db.podcasting.findOne({id: addHousTalk.id})
                    return {
                        status: true,
                        message: 'HouseTalk Added Successfully',
                        data: {singleData:update_data,allData:findAllHousTalk.length},
                    
                    }
                }else{
                    return {
                        status: false,
                        message: 'You Reached your maximum limit you cannot upload more agents please contact with admin'
                    }
                }
            }
          
        } else {
            return {
                status: false,
                message: 'HouseTalk Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const generateCode = async (characters) => {
    const possible = 'abcdefghjklmn456789opqrsituvwxyz0123459ABCDEFGHJKLMNOPQR0123456789SITUVWXYZ0123456789'
    let code = ''
    let i = 0
    while (i < characters) {
        code += possible.charAt(Math.floor(Math.random() * possible.length))
        i++
    }
    return code
}

const getFormattedDate = async () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return year + month + day
}

const getAllHouseTalk = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        if (u_id) {
            const findAllHouseTalk = await db.podcasting.findAll({
                where: {
                    poster: u_id
                }
            })
            const reversedData = await findAllHouseTalk.reverse()
            return {
                status: true,
                message: 'All Banner Found successfully',
                data: reversedData
            }
        }
        return {
            status: false,
            message: 'No User Found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const findSingleHouseTalk = async (req) => {
    try {
        const {propertyId} = req.body
        const findSingleHouseTalk = await db.podcasting.findOne({where: {id: {[db.Op.eq]: `${propertyId}`}}})

        if (findSingleHouseTalk) {
            const ownerId = findSingleHouseTalk.poster
            const user = await db.member.findOne({where: {id: {[db.Op.eq]: `${ownerId}`}}})
            const similarProperties = await db.podcasting.findAll({
                where: {
                    poster: ownerId,
                    id: {
                        [db.Op.ne]: propertyId
                    }
                }
            })

            return {
                status: true,
                message: 'Property Found Successfully',
                data: {
                    property: findSingleHouseTalk,
                    similarProperties: similarProperties,
                    user: user
                }
            }
        }

        return {
            status: false,
            message: 'Property not Found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const singleHouseTalk = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        if (u_id) {
            const {propertyId} = req.body
            const findSingleHouseTalk = await db.podcasting.findOne({
                where: {
                    id: propertyId
                }
            })
            if (findSingleHouseTalk) {
                return {
                    status: true,
                    message: 'HouseTalk Found Successfully',
                    data: findSingleHouseTalk
                }
            }
            return {
                status: false,
                message: 'Housetalk NotFound'
            }
        }
        return {
            status: false,
            message: 'User Not Found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const editHouseTalk = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {housetalkId, title, address, addresslat, addresslng, addresslatlndate, facebook_bot_link, youtube_virtual_tour_id, ask_for_email_tel_feb, recieve_email_notifications, description, tags, prerollpod, postrollpod, mediaurl, url} = req.body
        if (u_id) {
            const findHouseTalk = await db.podcasting.findOne({where: {id: housetalkId}})
            if (findHouseTalk) {
                if (mediaurl) {
                    const uploadAudio = await s3AudioUpload(mediaurl)
                    const zencoderClient = new Zencoder(process.env.ZEN_CODER_API)
                    const video_shortcode = await generateCode(11)
                    const shortfilename = 'oht_' + (await getFormattedDate()) + '_' + video_shortcode
                    const inputUrl = `${process.env.AWS_S3_LINK}${uploadAudio}`

                    const encodingParams = {
                        input: inputUrl,
                        outputs: {
                            url: `s3://housetalk-media/${shortfilename + '.mp3'}`,
                            public: 1
                        }
                    }

                    zencoderClient.Job.create(encodingParams, async (err, data) => {
                        if (err) {
                            console.error('Error creating Zencoder job:', err)
                        } else {
                        }
                    })
                    const zencoderUrl = encodingParams.outputs.url.split('/').pop()
                    const updateHouseTalk = await db.podcasting.update({podcount: 1, poster: u_id, title: title, address: address, addresslat: addresslat, addresslng: addresslng, addresslatlndate: addresslatlndate, facebook_bot_link: facebook_bot_link, youtube_virtual_tour_id: youtube_virtual_tour_id, ask_for_email_tel_feb: ask_for_email_tel_feb, recieve_email_notifications: recieve_email_notifications, mediaurl: zencoderUrl, description: description, tags: tags, prerollpod: prerollpod, postrollpod: postrollpod, url: url}, {where: {id: findHouseTalk?.id}})
                    if (updateHouseTalk) {
                        await deleteAudio(findHouseTalk.mediaurl)

                        return {
                            status: true,
                            message: 'HouseTalk Updated Successfully'
                        }
                    }
                } else {
                    const updateHouseTalk = await db.podcasting.update({podcount: 1, poster: u_id, title: title, address: address, addresslat: addresslat, addresslng: addresslng, addresslatlndate: addresslatlndate, facebook_bot_link: facebook_bot_link, youtube_virtual_tour_id: youtube_virtual_tour_id, ask_for_email_tel_fb: ask_for_email_tel_feb, receive_email_notifications: recieve_email_notifications, mediaurl: findHouseTalk.mediaurl, description: description, tags: tags, prerollpod: prerollpod, postrollpod: postrollpod, url: url}, {where: {id: findHouseTalk?.id}})
                    return {
                        status: true,
                        message: 'HouseTalk Updated Successfully'
                    }
                }
            }
        }

        return {
            status: false,
            message: 'User Not Found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteHouseTalk = async (req) => {
    try {
        const {housetalkId} = req.body
        const u_id = await getUserIdFromToken(req)
        if (u_id) {
            const findHouseTalk = await db.podcasting.findOne({where: {id: housetalkId}})
            if (findHouseTalk) {
                await db.podcasting.destroy({where: {id: housetalkId}})
                const deleteaudio = await deleteAudio(findHouseTalk.mediaurl)
                const images=await getPicturesByFolder(`${u_id}_${housetalkId}`)
                if (images) {
                 await deleteMultipleImage(images)
                         }
               
                return {
                    status: true,
                    message: 'HouseTalk Deleted Successfully'
                }
            }
            return {
                status: false,
                message: 'HouseTalk Not Founded'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: 'HouseTalk Not Found'
        }
    }
}
const getAllUsers = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        if (u_id) {
            const findHouseTalk = await db.member.findAll({where: {type: 'user'}})
            const reversedData = await findHouseTalk.reverse()
            if (findHouseTalk) {
                return {
                    status: true,
                    message: 'HouseTalk Found Successfully',
                    data: reversedData
                }
            }
            return {
                status: false,
                message: 'HouseTalk Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: 'HouseTalk Not Found'
        }
    }
}

const getChildUserData = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const findChildUser = await db.member.findAll({
            where: {
                parentid: u_id
            }
        })
        const reversedData = await findChildUser.reverse()
        if (findChildUser) {
            return {
                status: true,
                message: 'Child Agent Found Successfully',
                data: reversedData
            }
        }
        return {
            status: false,
            message: 'Child User Not Found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const addChildAgentUser = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const {firstname, lastname, username, phone, email, password} = req.body
        const user = await db.member.findOne({where: {email: {[db.Op.eq]: `${email}`}}})
        if (!user) {
            const findUserName = await db.member.findOne({where: {username: {[db.Op.eq]: `${username}`}}})
            if (!findUserName) {
                const findChildUser = await db.member.findAll({
                    where: {
                        parentid: u_id
                    }
                })
                const parentUser = await db.member.findOne({where: {id: u_id}})
                if (parentUser.package === 2) {
                    if (findChildUser.length <= 9) {
                        const ipAddress = getIpAddress()
                        console.log("ip===>>>>",ipAddress);

                        let hashPassword = generateMD5Hash(password)
                        let _createUser = await db.member.create({package: 1, parentid: u_id, username: username, firstname: firstname, lastname: lastname, phone: phone, password: hashPassword, email: email, type: 'subuser', ip: ipAddress})
                        if (_createUser) {
                            _createUser = await db.member.findOne({where: {id: _createUser.id}})
                            const token = await generateAccessToken(_createUser)
                            _createUser.auth_token = token
                            _createUser.login_token = token
                            await db.member.update({auth_token: token, login_token: token}, {where: {id: _createUser.id}})

                            return {
                                status: true,
                                message: 'Child User registered successfully',
                                data: findChildUser
                            }
                        }
                    } else {
                        return {
                            status: false,
                            message: 'You Reached your maximum limit you cannot upload more agents please contact with admin'
                        }
                    }
                } else if (parentUser.package === 3) {
                    if (findChildUser.length <= 99) {
                        const ipAddress = getIpAddress()
                        let hashPassword = generateMD5Hash(password)
                        let _createUser = await db.member.create({package: 1, parentid: u_id, username: username, firstname: firstname, lastname: lastname, phone: phone, password: hashPassword, email: email, type: 'subuser', ip: ipAddress})
                        if (_createUser) {
                            _createUser = await db.member.findOne({where: {id: _createUser.id}})
                            const token = await generateAccessToken(_createUser)
                            _createUser.auth_token = token
                            _createUser.login_token = token
                            await db.member.update({auth_token: token, login_token: token}, {where: {id: _createUser.id}})
                            return {
                                status: true,
                                message: 'Child User registered successfully',
                                data: findChildUser
                            }
                        }
                    } else {
                        return {
                            status: false,
                            message: 'You Reached your maximum limit you cannot upload more agents please contact with admin'
                        }
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'Username Already used'
                }
            }
        } else {
            return {
                status: false,
                message: 'Email already registered'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateHouseTalkUser = async (req) => {
    try {
        const {userId, firstname, lastname, username, company, phone, address, city, state, zip, singleAgent, teamAgent, brokerAgent, gender, age, location, country, aboutme, email, fbPixelData} = req.body
        const user = await db.member.findOne({where: {id: {[db.Op.eq]: `${userId}`}}})
        if (user) {
            const existingUserWithNewUsername = await db.member.findOne({
                where: {
                    username: username,
                    id: {[db.Op.ne]: userId}
                }
            })
            if (existingUserWithNewUsername) {
                return {
                    status: false,
                    message: 'User Name Already Exist'
                }
            } else {
                const update_user = await db.member.update({username: username, firstname: firstname, lastname: lastname, company: company, phone: phone, address: address, city: city, state: state, zip: zip, package: singleAgent ? singleAgent : teamAgent ? teamAgent : brokerAgent ? brokerAgent : 0, gender: gender, age: age, location: location, country: country, aboutme: aboutme, email: email, facebook_pixel: fbPixelData}, {where: {id: user?.id}})
                if (update_user) {
                    return {
                        status: true,
                        message: 'User Updated Successfully'
                    }
                }
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateUserStatus = async (req) => {
    try {
        const {userId, email, smsmessagecount, inactive, resetPassword} = req.body
        const user = await db.member.findOne({where: {id: userId}})

        if (user) {
            let updatedFields = {
                email: email,
                smsmessagecount: smsmessagecount,
                banned: inactive ? 1 : 0
            }
            if (resetPassword) {
                updatedFields.password = generateMD5Hash(user.username)
                await adminResetUserPassword(email, user.username)
            }

            const updateUser = await db.member.update(updatedFields, {where: {id: user?.id}})

            if (updateUser) {
                return {
                    status: true,
                    message: 'User Updated Successfully'
                }
            }
        }

        return {
            status: false,
            message: 'User Not Found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const editEmailData = async (req) => {
    try {
        const {housetalkId, sms10, sms30, sms40} = req.body
        const findHouseTalk = await db.podcasting.findOne({where: {id: housetalkId}})
        if (findHouseTalk) {
            const updateHouseTalk = await db.podcasting.update({emailsms10: sms10, emailsms30: sms30, emailsms40: sms40}, {where: {id: findHouseTalk?.id}})
            return {
                status: true,
                message: 'Email Text Updated Successfully'
            }
        } else {
            return {
                status: false,
                message: 'HouseTalk Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

// const viewStatisticsOfHoustalk = async (req) => {
//     try {
//         const {propertyId, inquirerEmail, reffrer, friend, requestedCallBack} = req.body
//         const visitorIp = getIpAddress()
//         const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquirerEmail)
//         const isPhoneNumber = /^\d+$/.test(inquirerEmail)
//         const findProperty = await db.podcasting.findOne({where: {id: {[db.Op.eq]: `${propertyId}`}}})
//         const member = await db.member.findOne({where: {id: {[db.Op.eq]: `${findProperty.poster}`}}})
//         const agentEmail = member.email;
//         console.log("findProperty.posterfindProperty.posterfindProperty.posterfindProperty.posterfindProperty.poster",member.id,member.email,member.phone)
//         if (findProperty) {
//             const memberId = await findProperty.poster
//             const propertyTitle = await findProperty.title
//             const propertyAddress = await findProperty.address
//             const ipAddress = await getClientIP(req)
//             const createStats = await db.visitstate.create({property_id: propertyId, inquirer_email_tel: inquirerEmail, member_id: memberId, visitor_ip: ipAddress})
//             if (createStats) {
//                 if (isEmail) {
//                     await sendPropertyIdEmail(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)
//                     if(member.email){
//                        // await sendPropertyIdEmailAgent(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress,agentEmail)
//                     }

//                     //await recievedEmailToClient(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)

//                     return {
//                         status: true,
//                         message: `Link Send to Your ${inquirerEmail} successfully`
//                     }
//                 } else if (isPhoneNumber) {
//                     await sendSms(inquirerEmail, propertyId)
//                     if(member.phone){
//                         //await recievedEmailToClient(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)
//                     }

//                     return {
//                         status: true,
//                         message: `Link Send to Your ${isPhoneNumber} successfully`
//                     }
//                 }
//             }
//         } else {
//             return {
//                 status: false,
//                 message: 'Property Not Found'
//             }
//         }
//     } catch (error) {
//         return {
//             status: false,
//             message: error.message
//         }
//     }
// }

const viewStatisticsOfHoustalk = async (req) => {
    try {
        const {propertyId, inquirerEmail, reffrer, friend, requestedCallBack, lat, lng, platform} = req.body
        const visitorIp = getIpAddress()
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquirerEmail)
        const isPhoneNumber = /^\d+$/.test(inquirerEmail)
        const findProperty = await db.podcasting.findOne({where: {id: {[db.Op.eq]: `${propertyId}`}}})
        const member = await db.member.findOne({where: {id: {[db.Op.eq]: `${findProperty.poster}`}}})
        const agentEmail = member.email
        console.log('findProperty.posterfindProperty.posterfindProperty.posterfindProperty.posterfindProperty.poster', member.id, member.email, member.phone)
        if (findProperty) {
            const memberId = await findProperty.poster
            const propertyTitle = await findProperty.title
            const propertyAddress = await findProperty.address
            const ipAddress = await getIpAddress()
            const createStats = await db.visitstate.create({property_id: propertyId, inquirer_email_tel: inquirerEmail, member_id: memberId, visitor_ip: ipAddress})
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', lat, lng, isEmail, isPhoneNumber, platform, propertyId, ipAddress)
            const createInComingCustomer = await db.incomingCustomer.create(
                {member_id: memberId, lat: lat, lng: lng, email: isEmail ? inquirerEmail : null, phone: isPhoneNumber ? inquirerEmail : null, platform: platform, property_id: propertyId, ip: ipAddress},
                {
                    returning: ['id'] // Specify the fields you want to return
                }
            )
            
            if (createStats) {
                if (isEmail) {
                    await sendPropertyIdEmail(propertyId, inquirerEmail, propertyTitle, propertyAddress, createInComingCustomer.id,findProperty?.emailsms10,findProperty?.emailsms30,findProperty?.emailsms40,member?.firstname,member?.company,member?.phone,member?.email)
                    if (member.email_notifications_on_visitor_activity == true) {
                        member.email && (await sendPropertyIdEmailAgent(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress, agentEmail))
                        member.phone && sendSmsAgent(member.phone, inquirerEmail, propertyId, propertyTitle, propertyAddress, ipAddress)
                    }

                    //await recievedEmailToClient(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)

                    return {
                        status: true,
                        message: `Link Send to Your ${inquirerEmail} successfully`
                    }
                } else if (isPhoneNumber) {
                    await sendSms(inquirerEmail, propertyId, createInComingCustomer.id)
                    if (member.email_notifications_on_visitor_activity == true) {
                        //await recievedEmailToClient(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)
                        member.email && (await sendPropertyIdEmailAgent(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress, agentEmail))
                        member.phone && sendSmsAgent(member.phone, inquirerEmail, propertyId, propertyTitle, propertyAddress, ipAddress)
                    }

                    return {
                        status: true,
                        message: `Link Send to Your ${isPhoneNumber} successfully`
                    }
                }
            }
        } else {
            return {
                status: false,
                message: 'Property Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

//qasim
const getAllIncomingCustomerStat = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const findStats = await db.incomingCustomer.findAll({where: {member_id: {[db.Op.eq]: `${u_id}`}}})
        if (findStats) {
            return {
                status: true,
                message: 'Data Found Successfully',
                data: findStats
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const updateIncomingCustomerStat = async (req) => {
    try {
        const {id, propertyIdToMatch, latToUpdate, lngToUpdate} = req.body

        console.log("propertyIdToMatchpropertyIdToMatch========>",latToUpdate,propertyIdToMatch,req.body)
        const ipToMatch = getIpAddress()
        //const findInCustomer = await db.incomingCustomer.findOne({where: {id: id}})
        console.log('###$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
        // if (findInCustomer) {
        //     await db.incomingCustomer.update(
        //         {
        //             is_visited: true,
        //             count: Sequelize.literal(`count + 1`)
        //         },
        //         {
        //             where: {id}
        //         }
        //     )
        //     return {
        //         status: true,
        //         message: 'Updated Successfully'
        //     }
        // }
        // Try to find an existing record with matching 'ip' and 'property_id'
        const existingCustomer = await db.incomingCustomer.findOne({
            where: {
                ip: ipToMatch,
                property_id: propertyIdToMatch
            }
        })
        if (existingCustomer) {
            // If a matching record exists, increment the 'count' field and update 'lat' and 'lng'
            await existingCustomer.update({
                count: Sequelize.literal(`count + 1`), // Increment 'count'
                lat: latToUpdate,
                lng: lngToUpdate,
                is_visited: true
            })
console.log("=======>",existingCustomer)
return {
    status: true,
    message:"updated"
}
        } else {
            console.log("existingCustomerexistingCustomerexistingCustomer",existingCustomer)
            // If no matching record exists, create a new entry with the specified 'ip'
            await db.incomingCustomer.create({
                ip: ipToMatch,
                property_id: propertyIdToMatch,
                lat: latToUpdate,
                lng: lngToUpdate,
                is_visited: true, // Set 'is_visited' to true for the new entry
                count: 1 // Set 'count' to 1 for the new entry
            })

            return {
                status: true,
                message:"updated"
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const checkProperty = async (req) => {
    try {
        const {propertyId} = req.body
        const findProperty = await db.podcasting.findOne({where: {id: {[db.Op.eq]: `${propertyId}`}}})
        if (findProperty) {
            const findPropertyUser = await db.member.findOne({where: {id: {[db.Op.eq]: `${findProperty.poster}`}}})
            return {
                status: true,
                message: 'State added successfully',
                data: {
                    property: findProperty,
                    user: findPropertyUser
                }
            }
        } else {
            return {
                status: false,
                message: 'Property Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllStatsViews = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        const findStats = await db.visitstate.findAll({where: {member_id: {[db.Op.eq]: `${u_id}`}}})
        if (findStats) {
            return {
                status: true,
                message: 'All'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const countAllVisitViews = async (req) => {
    try {
        const {propertyId} = req.body
        const findStats = await db.visitstate.findAll({where: {property_id: {[db.Op.eq]: `${propertyId}`}}})
        if (findStats) {
            return {
                status: true,
                message: 'Property found Successfully',
                data: findStats
            }
        } else {
            return {
                status: false,
                message: 'Property Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const autoSmsReply = async (req) => {
    try {
        const propertyId = req.body.Body
        const customerNumber = req.body.From
        const user = await db.podcasting.findOne({where: {id: {[db.Op.eq]: `${propertyId}`}}})
        if (user) {
            const smsData = db.sms.create({property_id: propertyId, customer_number: customerNumber})
            if (smsData) {
                await sendSms(customerNumber, `${propertyId}`)

                return {
                    status: true,
                    message: 'Customer Added Successfully'
                }
            }
        } else {
            await sendSms(customerNumber, `Not valid`)
            return {
                status: true,
                message: 'Sms Send Successfully'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const adminData = async () => {
    try {
        const findAdmin = await await db.member.findOne({where: {type: {[db.Op.eq]: `${'admin'}`}}})
        if (findAdmin) {
            return {
                status: true,
                message: 'Data Found Successfully',
                data: findAdmin
            }
        } else {
            return {
                status: false,
                message: 'Admin Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const geoFencing = async () => {
    try {
        const {latitude, langitude} = req.body
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const getAllHomepageBanners = async (req) => {
    try {
        const {templateuserid} = req.body
        const userTemplates = await db.frontendtemplate.findAll({where: {templateuserid: templateuserid}})
        if (userTemplates) {
            return {
                status: true,
                message: 'Template found successfully',
                data: userTemplates
            }
        }
        return {
            status: false,
            message: 'Template not found'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const tellAFreind = async (req) => {
    try {
        const {propertyId, inquirerEmail, reffrer, friend, requestedCallBack} = req.body
        const visitorIp = getIpAddress()
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquirerEmail)
        const isPhoneNumber = /^\d+$/.test(inquirerEmail)
      
        const findProperty = await db.podcasting.findOne({where: {id: {[db.Op.eq]: `${propertyId}`}}})
        const member = await db.member.findOne({where: {id: {[db.Op.eq]: `${findProperty.poster}`}}})
        if (findProperty) {
            const memberId = await findProperty.poster
            const propertyTitle = await findProperty.title
            const propertyAddress = await findProperty.address
            const ipAddress = await getClientIP(req)
            console.log("friend",friend);
            console.log("reffrer===>>>>>",reffrer);
            const createStats = await db.visitstate.create({property_id: propertyId, member_id: memberId, visitor_ip: ipAddress, referrer: inquirerEmail, friend: friend})
            if (createStats) {
                if (isEmail) {
                    await sendEmailToFreind(propertyId, inquirerEmail,friend, propertyTitle, propertyAddress, ipAddress, reffrer,findProperty?.emailsms30,findProperty?.emailsms40,member?.firstname,member?.company,member?.phone,member?.email)
                    await recievedEmailToClient(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)
                    return {
                        status: true,
                        message: `Link Send to Your ${inquirerEmail} successfully`
                    }
                } else if (isPhoneNumber) {
                    await sendSmsFreind(inquirerEmail, propertyId, reffrer)
                    await recievedEmailToClient(propertyId, inquirerEmail, propertyTitle, propertyAddress, ipAddress)
                    return {
                        status: true,
                        message: `Link Send to Your ${isPhoneNumber} successfully`
                    }
                }
            }
        } else {
            return {
                status: false,
                message: 'Property Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const showImagesArray = async (req) => {
    try {
        const {propertyId, userId} = req.body
        const u_id = await getUserIdFromToken(req)

        const showImages = u_id ? await getPicturesByFolder(`${u_id}_${propertyId}`) : userId ? await getPicturesByFolder(`${userId}_${propertyId}`) : ''
        if (showImages) {
            return {
                status: true,
                message: 'All Images Found',
                data: showImages
            }
        } else {
            return {
                status: false,
                message: 'Images Not Found',
                data: showImages
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const uploadAndUpdateImage = async (req) => {
    try {
        const {files, propertyId} = req.body
        const u_id = await getUserIdFromToken(req)
        const folderName = `${u_id}_${propertyId}`

        const images = await s3ImageUploadInFolder(files, folderName)

        console.log('images', images)
        if (images.length > 1) {
            return {
                status: true,
                message: 'New Images Added'
            }
        }
        return {
            status: true,
            message: 'Images Updated'
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const forgotPassword = async (req) => {
    try {
        const {email} = req.body
        const findEmail = await db.member.findOne({where: {email: email}})

        if (findEmail) {
            const resetToken = await generateAccessTokenForPasswordRest(findEmail)
            await resetPasswordEmail(resetToken, email)
            return {
                status: true,
                message: 'Email Sent Successfully'
            }
        } else {
            return {
                status: false,
                message: 'Its not the register Email Please Provide valid email'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const resetPasswordLink = async (req) => {
    try {
        const {token} = req.body
        const resetToken = await verifyResetToken(token)
        if (resetToken) {
            return {
                status: true,
                message: 'Link Found'
            }
        } else {
            return {
                status: false,
                message: 'Link Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const resetPassword = async (req) => {
    try {
        const {token, password} = req.body
        const u_id = await getUserIdFromResetLink(token)
        let updatedUser = await db.member.findOne({where: {id: u_id}})
        if (updatedUser) {
            const updatedPassword = generateMD5Hash(password)
            await db.member.update({password: updatedPassword}, {where: {id: u_id}})
            return {
                status: true,
                message: 'Password Successfully reset'
            }
        } else {
            return {
                status: false,
                message: 'User Not Found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const radiusSearchOptions = async (req) => {
    try {
        const {thresHold, addressLat, addressLong } = req.body;
        const u_id=await getUserIdFromToken(req)
        const allLocations = await db.incomingCustomer.findAll({where: {member_id: {[db.Op.eq]: `${u_id}`}}});
        const allProperties = await db.podcasting.findAll({where: {poster: {[db.Op.eq]: `${u_id}`}}});

        const withinRadiusLocations = allLocations.filter(location => {
            const distance = geolib.getDistance(
                { latitude: location.lat, longitude: location.lng },
                { latitude: addressLat, longitude: addressLong }
            );
            const distanceInMiles = distance / 1609.34;
            return distanceInMiles <= thresHold;
        });
        const withinNearByLocations = allProperties.filter(location => {
            const distance = geolib.getDistance(
                { latitude: location.addresslat, longitude: location.addresslng },
                { latitude: addressLat, longitude: addressLong }
            );
            const distanceInMiles = distance / 1609.34;
            return distanceInMiles <= thresHold;
        });
        if (withinNearByLocations.length > 0 || withinRadiusLocations.length> 0 ) {
            return {
                status: true,
                message: 'Properties Found Successfully',
                data: {
                   withinRadius: withinRadiusLocations,
                   nearBy:withinNearByLocations}
            };
        } else {
            return {
                status: false,
                message: 'There are no properties listed in this Threshold',
                locations: []
            };
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            locations: []
        };
    }
};

const sendPromotionsToUser = async (req) => {
    try {
      const { property,promotionsData,description } = req.body;

      const emails = promotionsData.filter(data => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
      });
  
      const phoneNumbers = promotionsData.filter(data => {
        return /^\d+$/.test(data);
      });
  
     
      await sendPromotions(property,emails,description);
      await sendPromotionsSms(property,phoneNumbers,description);
  
     
  
      return {
        status: true,
        message: "Promotions sent successfully",
        
      };
    } catch (error) {
      return {
        status: false,
        message: error.message,
        locations: [],
      };
    }
  };
  
  const getAllChildAgentHouseTalk = async (req) => {
    try {

        const u_id=await getUserIdFromToken(req)
      const getAllUser = await db.member.findAll({
        where: {
          parentid: u_id
        }
      });
  
    if (getAllUser) {
        const podcastingDataArray = []; 
  
        for (let i = 0; i < getAllUser.length; i++) {
          const user = getAllUser[i];
          const findAgentHouseTalk = await db.podcasting.findAll({
            where: {
              poster: user.id
            }
          });
    
          
          const userDataWithPodcasting = {
            userName: user.username, 
            id:user.id,
            podcastingData: findAgentHouseTalk
          };
    
          podcastingDataArray.push(userDataWithPodcasting);
        }  
        
        return {
          status: true,
          message:"All Properties Find Successfully",
          data: podcastingDataArray
        };
    }
  
    
    } catch (error) {
      return {
        status: false,
        message: error.message
      };
    }
  }
  

export {memberProfile, editMember, loginUser, updateMember, manageMemberHomaPage, activeHomePageBanner, updateManageMemberHomaPage, getAllHomePageBanner, addHouseTalk, editBanner, getAllHouseTalk, deleteHomePageBanner, findSingleHouseTalk, editHouseTalk, singleHouseTalk, deleteHouseTalk, getAllUsers, addHouseTalkUser, deleteHouseTalkUser, getChildUserData, addChildAgentUser, updateHouseTalkUser, updateUserStatus, editEmailData, viewStatisticsOfHoustalk, checkProperty, getAllStatsViews, countAllVisitViews, autoSmsReply, adminData, geoFencing, getAllHomepageBanners, tellAFreind, showImagesArray, uploadAndUpdateImage, forgotPassword, resetPasswordLink, resetPassword, getAllIncomingCustomerStat, updateIncomingCustomerStat,radiusSearchOptions,sendPromotionsToUser,getAllChildAgentHouseTalk}
