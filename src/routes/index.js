import express from 'express'
import * as adminRoute from '../routes/adminRoute.js'
import * as memberRoute from '../routes/memberRoute.js'
import * as recordingPodRoutes from '../routes/recordingPodRoutes.js'
import * as featuredHouseTalkRouter from '../routes/featuredHouseTalkRouter.js'

const router = express.Router()

router.use('/admin', adminRoute.router)
router.use('/member', memberRoute.router)
router.use('/recordingpod', recordingPodRoutes.router)
router.use('/featurehousetalk', featuredHouseTalkRouter.router)

export {router}
