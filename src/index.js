import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import * as routes from './routes/index.js'
import db from './models/index.js'
//import {autoCreate} from './services/userService.js'

const server = express()

db.sequelize
    .sync({alter: true})
    .then(async () => {
        //await autoCreate()
    })
    .catch((error) => {
        console.error(error.message)
    })

server.use(cors())

server.use(express.json({limit: '50mb', extended: true}))
server.use(express.urlencoded({limit: '50mb', parameterLimit: 1000000, extended: true}))

server.use('/', cors(), routes.router)

server.listen(process.env.SERVER_PORT, () => {
    console.log('Server listening on port ' + `${chalk.green(process.env.SERVER_PORT)}`)
})

export default server
