import * as memberService from '../services/memberService.js'
import responseUtil from '../utilities/response.js'

const memberProfile = async (req, res) => {
    const response = await memberService.memberProfile(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            member_details: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const editMember = async (req, res) => {
    const response = await memberService.editMember(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, {
            is_edit: response.data
        })
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const loginUser = async (req, res) => {
    const response = await memberService.loginUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateMember = async (req, res) => {
    const response = await memberService.updateMember(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const manageMemberHomaPage = async (req, res) => {
    const response = await memberService.manageMemberHomaPage(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const activeHomePageBanner = async (req, res) => {
    const response = await memberService.activeHomePageBanner(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getAllHomePageBanner = async (req, res) => {
    const response = await memberService.getAllHomePageBanner(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getAllHomePageBanners = async (req, res) => {
    const response = await memberService.getAllHomepageBanners(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const deleteHomePageBanner = async (req, res) => {
    const response = await memberService.deleteHomePageBanner(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const editBanner = async (req, res) => {
    const response = await memberService.editBanner(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addHouseTalk = async (req, res) => {
    const response = await memberService.addHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllHouseTalk = async (req, res) => {
    const response = await memberService.getAllHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const findSingleHouseTalk = async (req, res) => {
    const response = await memberService.findSingleHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const editHouseTalk = async (req, res) => {
    const response = await memberService.editHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const singleHouseTalk = async (req, res) => {
    const response = await memberService.singleHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const deleteHouseTalk = async (req, res) => {
    const response = await memberService.deleteHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllUsers = async (req, res) => {
    const response = await memberService.getAllUsers(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const addHouseTalkUser = async (req, res) => {
    const response = await memberService.addHouseTalkUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const deleteHouseTalkUser = async (req, res) => {
    const response = await memberService.deleteHouseTalkUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getChildUserData = async (req, res) => {
    const response = await memberService.getChildUserData(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const addChildAgentUser = async (req, res) => {
    const response = await memberService.addChildAgentUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const updateHouseTalkUser = async (req, res) => {
    const response = await memberService.updateHouseTalkUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateUserStatus = async (req, res) => {
    const response = await memberService.updateUserStatus(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const editEmailData = async (req, res) => {
    const response = await memberService.editEmailData(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const viewStatisticsOfHoustalk = async (req, res) => {
    const response = await memberService.viewStatisticsOfHoustalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const getAllIncomingCustomerStat = async (req, res) => {
    const response = await memberService.getAllIncomingCustomerStat(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const updateIncomingCustomerStat = async (req, res) => {
    const response = await memberService.updateIncomingCustomerStat(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}




const checkProperty = async (req, res) => {
    const response = await memberService.checkProperty(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllStatsViews = async (req, res) => {
    const response = await memberService.getAllStatsViews(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const countAllVisitViews = async (req, res) => {
    const response = await memberService.countAllVisitViews(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const autoSmsReply = async (req, res) => {
    const response = await memberService.autoSmsReply(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const adminData = async (req, res) => {
    const response = await memberService.adminData(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const geoFencing = async (req, res) => {
    const response = await memberService.geoFencing(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const tellAFreind = async (req, res) => {
    const response = await memberService.tellAFreind(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const showImagesArray = async (req, res) => {
    const response = await memberService.showImagesArray(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const uploadAndUpdateImage = async (req, res) => {
    const response = await memberService.uploadAndUpdateImage(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const forgotPassword = async (req, res) => {
    const response = await memberService.forgotPassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const resetPasswordLink = async (req, res) => {
    const response = await memberService.resetPasswordLink(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const resetPassword = async (req, res) => {
    const response = await memberService.resetPassword(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}
const radiusSearchOptions=async (req, res) => {
    const response = await memberService.radiusSearchOptions(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const sendPromotionsToUser=async (req, res) => {
    const response = await memberService.sendPromotionsToUser(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

const getAllChildAgentHouseTalk=async (req, res) => {
    const response = await memberService.getAllChildAgentHouseTalk(req)
    if (response.status) {
        return responseUtil.successResponse(res, response.message, response.data)
    } else {
        return responseUtil.validationErrorResponse(res, response.message)
    }
}

export {memberProfile, editMember, loginUser, updateMember, manageMemberHomaPage, activeHomePageBanner, getAllHomePageBanner, addHouseTalk, editBanner, getAllHouseTalk, deleteHomePageBanner, findSingleHouseTalk, editHouseTalk, singleHouseTalk, deleteHouseTalk, getAllUsers, addHouseTalkUser, deleteHouseTalkUser, getChildUserData, addChildAgentUser, updateHouseTalkUser, updateUserStatus, editEmailData, viewStatisticsOfHoustalk, checkProperty, getAllStatsViews, countAllVisitViews, autoSmsReply, adminData, geoFencing, getAllHomePageBanners, tellAFreind, showImagesArray, uploadAndUpdateImage, forgotPassword, resetPassword, resetPasswordLink,getAllIncomingCustomerStat,updateIncomingCustomerStat,radiusSearchOptions,sendPromotionsToUser,getAllChildAgentHouseTalk}
