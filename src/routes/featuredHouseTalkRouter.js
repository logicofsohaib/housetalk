import express from 'express'
import * as featuredHouseTalkController from '../controllers/featuredHouseTalkController.js'
import {verifyAuthToken} from '../utilities/authentication.js'

const router = express.Router()

router.post('/getall', verifyAuthToken(), featuredHouseTalkController.getAllFeaturedPodCasting)
router.post('/add', verifyAuthToken(), featuredHouseTalkController.addFeaturedPod)
router.post('/delete', verifyAuthToken(), featuredHouseTalkController.deleteFeaturePod)

export {router}
