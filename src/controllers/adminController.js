import * as adminService from '../services/adminService.js'
import responseUtil from '../utilities/response.js'


const getEmail = async (req, res) => {


    const response = await adminService.getEmail(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            member_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const adminLogin = async (req, res) => {
    const response = await adminService.adminLogin(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            admin_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const addProduct = async (req, res) => {
    const response = await adminService.addProduct(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            admin_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const viewStats = async (req, res) => {
    const response = await adminService.viewStats(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            user_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const userProfileUpdated = async (req, res) => {
    const response = await adminService.userProfileUpdated(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUser = async (req, res) => {
    const response = await adminService.updateUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

//All users for excel sheet
const exportAllUsers = async (req, res) => {
    const response = await adminService.exportAllUsers(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            all_users: response.data.all_users
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const blockReportedUser = async (req, res) => {
    const response = await adminService.blockReportedUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const unBlockUser = async (req, res) => {
    const response = await adminService.unBlockUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {getEmail,adminLogin, viewStats, userProfileUpdated, updateUser, exportAllUsers, blockReportedUser, unBlockUser, addProduct}
