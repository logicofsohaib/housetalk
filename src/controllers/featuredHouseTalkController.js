import * as recordingpodServices from '../services/recordingpodServices.js'
import responseUtil from '../utilities/response.js'

const getAllFeaturedPodCasting = async (req, res) => {
    const response = await recordingpodServices.getAllFeaturedPodCasting(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addFeaturedPod = async (req, res) => {
    const response = await recordingpodServices.addFeaturedPod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteFeaturePod = async (req, res) => {
    const response = await recordingpodServices.deleteFeaturePod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {getAllFeaturedPodCasting, addFeaturedPod, deleteFeaturePod}
