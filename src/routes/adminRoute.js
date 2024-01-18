import express from 'express'
import * as adminController from '../controllers/adminController.js';
import {verifyAuthToken} from '../utilities/authentication.js'

const router = express.Router()

router.post('/login', adminController.adminLogin)
/* router.get('/email', adminController.getEmail) */

export {router}
