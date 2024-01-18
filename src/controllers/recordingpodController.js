import * as recordingpodServices from '../services/recordingpodServices.js'
import responseUtil from '../utilities/response.js'

const getrecordingPod = async (req, res) => {
    const response = await recordingpodServices.getrecordingPod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const addrecordingPod = async (req, res) => {
    const response = await recordingpodServices.addrecordingPod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const editrecordingPod = async (req, res) => {
    const response = await recordingpodServices.editrecordingPod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const watchrecordingPod = async (req, res) => {
    const response = await recordingpodServices.watchrecordingPod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const deleterecordingPod = async (req, res) => {
    const response = await recordingpodServices.deleterecordingPod(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            recording_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {getrecordingPod, addrecordingPod, editrecordingPod, watchrecordingPod, deleterecordingPod}
