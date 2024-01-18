import db from '../models/index.js'
import {getUserIdFromToken} from '../utilities/authentication.js'
import {deleteAudio, s3AudioUpload, s3SharpImageUpload, userProfileImage} from './aws.js'
import Zencoder from 'zencoder'

const getrecordingPod = async (req) => {
    try {
        //const {recpoduser} = req.body
        const u_id = await getUserIdFromToken(req)

        if (u_id) {
            const memberData = await db.recordingpod.findAll({
                where: {
                    recpoduser: u_id
                }
            })
            const reverseData = await memberData.reverse()
            if (memberData) {
                return {status: true, message: 'success', data: reverseData}
            }
            return {
                status: false,
                message: 'Wrong'
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

const addrecordingPod = async (req) => {
    //console.log("this is audio uplod>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    try {
        const u_id = await getUserIdFromToken(req)
        const {videobuffer, description, pod_type} = req.body

        const video_shortcode = await generateCode(11)
        const shortfilename = 'oht_' + (await getFormattedDate()) + '_' + video_shortcode

        const result = await s3AudioUpload(videobuffer)

        const s3url =process.env.AWS_S3_LINK

        const zencoderClient = new Zencoder(process.env.ZEN_CODER_API)
        const inputUrl = `${process.env.AWS_S3_LINK}${result}`
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
                await deleteAudio(`${s3url}/${result}`)
            }
        })
        const zenencoderUrl = encodingParams.outputs.url.split('/').pop()
        const createRecordingPod = await db.recordingpod.create({recpoduser: u_id, recpod: zenencoderUrl, description: description, pod_type: pod_type})
        let updatedRecordingPod = await db.recordingpod.findAll({where: {recpoduser: u_id}})

        if (createRecordingPod) {
            return {
                status: true,
                message: `SuccessFully uploaded an ${pod_type}`,
                data: updatedRecordingPod
            }
        } else {
            return {
                status: false,
                message: 'success',
                data: updatedRecordingPod
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const editrecordingPod = async (req) => {
    try {
        const {videobuffer, description, pod_type, recpodid} = req.body
        const u_id = await getUserIdFromToken(req)
        if (videobuffer) {
            const video_shortcode = await generateCode(11)
            const shortfilename = 'oht_' + (await getFormattedDate()) + '_' + video_shortcode
            const result = await s3AudioUpload(videobuffer)

            const zencoderClient = new Zencoder(process.env.ZEN_CODER_API)
            const inputUrl = `${process.env.AWS_S3_LINK}${result}`
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
                    await deleteAudio(`${process.env.AWS_S3_LINK}/${result}`)
                }
            })

            const update_template = await db.recordingpod.update(
                {
                    description: description,
                    pod_type: pod_type,
                    recpod: encodingParams.outputs.url.split('/').pop()
                },
                {where: {recpodid: recpodid}}
            )
            let updatedUser = await db.recordingpod.findOne({where: {recpodid: recpodid}})
            let updatedRecordingPod = await db.recordingpod.findAll({where: {recpoduser: u_id}})

            return {
                status: true,
                message: 'success',
                data: updatedRecordingPod
            }
        } else {
            const update_template = await db.recordingpod.update(
                {
                    description: description,
                    pod_type: pod_type
                },
                {where: {recpodid: recpodid}}
            )
            let updatedUser = await db.recordingpod.findOne({where: {recpodid: recpodid}})
            let updatedRecordingPod = await db.recordingpod.findAll({where: {recpoduser: u_id}})
            return {
                status: true,
                message: 'success',
                data: updatedRecordingPod
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const watchrecordingPod = async (req) => {
    try {
        //const {recpoduser} = req.body
        const {recpodid} = req.body
        if (recpodid) {
            const podData = await db.recordingpod.findAll({
                where: {
                    recpodid: recpodid
                }
            })
            if (podData) {
                return {
                    status: true,
                    message: 'success',
                    data: podData
                }
            }
            return {
                status: false,
                message: 'Wrong'
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
const deleterecordingPod = async (req) => {
    try {
        //const {recpoduser} = req.body
        const u_id = await getUserIdFromToken(req)

        const {recpodid} = req.body
        if (recpodid) {
            const recordingData = await db.recordingpod.findOne({where: {recpodid: {[db.Op.eq]: `${recpodid}`}}})
            const podData = await db.recordingpod.destroy({
                where: {
                    recpodid: recpodid
                }
            })

            if (podData) {
                const deletefile = await deleteAudio(recordingData.recpod)
                const memberData = await db.recordingpod.findAll({
                    where: {
                        recpoduser: u_id
                    }
                })
                return {
                    status: true,
                    message: 'audio deleted successfully',
                    data: memberData
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

const generateCode = async (characters) => {
    /* list all possible characters, similar looking characters and vowels have been removed */
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

const getAllFeaturedPodCasting = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)
        if (u_id) {
            const featuredData = await db.podcasting.findAll({
                where: {
                    poster: u_id,
                    is_featured: '1'
                }
            })
            if (featuredData) {
                return {
                    status: true,
                    message: 'success',
                    data: featuredData
                }
            }
            return {
                status: false,
                message: 'Wrong'
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

const addFeaturedPod = async (req) => {
    const u_id = await getUserIdFromToken(req)
    const {recpodid} = req.body

    try {
        const update_template = await db.podcasting.update(
            {
                is_featured: '1'
            },
            {where: {id: recpodid}}
        )
        const featuredData = await db.podcasting.findAll({
            where: {
                poster: u_id,
                is_featured: '1'
            }
        })

        if (featuredData) {
            return {
                status: true,
                message: 'success',
                data: featuredData
            }
        } else {
            return {
                status: false,
                message: 'result not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const deleteFeaturePod = async (req) => {
    try {
        const u_id = await getUserIdFromToken(req)

        const {recpodid} = req.body
        if (recpodid) {
            const update_template = await db.podcasting.update(
                {
                    is_featured: '0'
                },
                {where: {id: recpodid}}
            )

            const featuredData = await db.podcasting.findAll({
                where: {
                    poster: u_id,
                    is_featured: '1'
                }
            })

            if (featuredData) {
                return {
                    status: true,
                    message: 'success',
                    data: featuredData
                }
            } else {
                return {
                    status: false,
                    message: 'result not found'
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

export {getrecordingPod, addrecordingPod, editrecordingPod, watchrecordingPod, deleterecordingPod, getAllFeaturedPodCasting, addFeaturedPod, deleteFeaturePod}
