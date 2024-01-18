import express from 'express'
import * as recordingpodController from '../controllers/recordingpodController.js'
import {verifyAuthToken} from '../utilities/authentication.js'

const router = express.Router()

router.post('/get', verifyAuthToken(), recordingpodController.getrecordingPod)
router.post('/add', verifyAuthToken(), recordingpodController.addrecordingPod)
router.post('/edit', verifyAuthToken(), recordingpodController.editrecordingPod)
router.post('/watch', verifyAuthToken(), recordingpodController.watchrecordingPod)
router.post('/delete', verifyAuthToken(), recordingpodController.deleterecordingPod)
export {router}
