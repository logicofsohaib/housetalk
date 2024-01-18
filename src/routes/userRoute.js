import express from 'express'
import {isSocialIdValidate, isVerificationCodeValidate, isProviderValidate, isFirstNameValidate, isUserNameValidate, isEmailValidate, isPhoneValidate, isAgeGroupValidate, isPasswordValidate, isRequestValid, isFollowerIdValidate} from '../validator/userValidation.js'
import * as userController from '../controllers/userController.js'
import {verifyAuthToken} from '../utilities/authentication.js'
import * as userNotificationController from '../controllers/userNotificationController.js'
import * as blockUserController from '../controllers/blockUserController.js'
import * as reportUserController from '../controllers/reportUserController.js'
import * as eventController from '../controllers/eventController.js'
import * as eventParticipentController from '../controllers/eventParticipentController.js'
import {isAgeRangeValidate, isCategoryValidate, isDescriptionValidate, isEndDateValidate, isLocationValidate, isParticipentsValidate, isPhotosValidate, isStartDateValidate, isTimeValidate, isTitleVlidate} from '../validator/eventValidation.js'

const router = express.Router()

router.post('/register', isEmailValidate, isPasswordValidate, isRequestValid, userController.registerUser)
router.get('/user_profile', verifyAuthToken(), userController.userMyProfile)
router.post('/create_poste', verifyAuthToken(), userController.addNewPost)
router.post('/update_poste/:posteId', verifyAuthToken(), userController.updatePoste)
router.delete('/delete_poste/:posteId', verifyAuthToken(), userController.deletePoste)
router.get('/get_all_post', verifyAuthToken(), userController.getAllPoste)
router.post('/add_like', verifyAuthToken(), userController.addLike)
router.post('/add_comment', verifyAuthToken(), userController.addComment)
router.get('/post', userController.AllPoste)

router.post('/product_good', userController.addNewProductGood)
router.post('/update_product_good/:product_good_id', userController.UpdateProductGood)
router.delete('/delete_product_good/:product_good_id', userController.DeleteProductGood)
router.get('/product', verifyAuthToken(), userController.allProductGood)
router.post('/add_category', userController.addCategoryToProduct)
router.post('/add_chemical', userController.addChemicalProductGood)
router.post('/sold_good_product', userController.soldProductGood)

router.post('/create_event', userController.addNewEvent)
router.post('/update', verifyAuthToken(), userController.updateUser)
//router.post('/login', isPasswordValidate, isRequestValid, userController.loginUser)
router.post('/social_login', isProviderValidate, isSocialIdValidate, isRequestValid, userController.socialLogin)
router.post('/social_update', verifyAuthToken(), isRequestValid, userController.updateSocialUser)
router.post('/auto_login', verifyAuthToken(), userController.autoLogin)
router.post('/send_register_code', verifyAuthToken(), isPhoneValidate, isRequestValid, userController.sendRegisterCode)
router.post('/verify_register_code', isEmailValidate, isVerificationCodeValidate, isRequestValid, userController.verfyRegisterCode)
router.post('/send_verification_code', isPhoneValidate, isRequestValid, userController.sendVerifictionCode)

router.post('/reset_password', isEmailValidate, isRequestValid, userController.resetPassword)

router.post('/reset_password/:userId', userController.updatePassword)

router.post('/my_contacts', verifyAuthToken(), userController.viewUserAllContacts)
router.post('/search_by_name', verifyAuthToken(), userController.searchByName)
router.post('/update_notification', verifyAuthToken(), userNotificationController.updateUserNotification)
router.post('/send_fcm', verifyAuthToken(), userController.sendChatFcm)
router.get('/notifications', verifyAuthToken(), userController.getAllNotification)
router.get('/profile', verifyAuthToken(), userController.getUserById)

router.delete('/delete_user', verifyAuthToken(), userController.deleteUserAllData)

router.post('/block_user', verifyAuthToken(), blockUserController.blockUser)
router.get('/all_blocked_user', verifyAuthToken(), blockUserController.allBlockedUsers)
router.post('/unblock_user', verifyAuthToken(), blockUserController.unBlockUser)

router.post('/report_user', verifyAuthToken(), reportUserController.reportUser)

router.post('/new_event', verifyAuthToken(), isTitleVlidate, isAgeRangeValidate, isDescriptionValidate, isStartDateValidate, isTimeValidate, isLocationValidate, isPhotosValidate, isCategoryValidate, isRequestValid, isParticipentsValidate, eventController.addEvent)
router.delete('/delete_event/:id', verifyAuthToken(), eventController.deleteEvent)
router.get('/all_events', verifyAuthToken(), eventController.getAllEvents)
router.put('/update_event/:id', verifyAuthToken(), eventController.updateEvent)
router.get('/event/:id', verifyAuthToken(), eventController.getEvent)

router.post('/add_participent', verifyAuthToken(), eventParticipentController.addParticipent)
router.delete('/delete_participent/:id', verifyAuthToken(), eventParticipentController.removeParticipent)
router.get('/all_participents/:event_id', verifyAuthToken(), eventParticipentController.getAllParticipents)

export {router}
