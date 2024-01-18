import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import jwt_decode from 'jwt-decode'
dotenv.config()
import db from '../models/index.js'

const generateAccessToken = async (_payload) => {
    const payload = {id: _payload.id}
    return jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: '60d'})
}

const generateAccessTokenAutoLogin = async (_payload) => {
    const payload = {id: _payload.id}
    return jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: '60d'}) // 60 days expiry time
}

// const generateRefreshToken = async (_payload) => {
//     const payload = {id: _payload.id}
//     const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
//         expiresIn: `${process.env.REFRESH_TOKEN_EXPIRY}s`
//     })
//     return {
//         refreshToken: token,
//         refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRY
//     }
// }

const verifyAuthToken = () => {
    return async (req, res, next) => {
        console.log('req==========', req.headers['authorization'])
        const token = req.headers['authorization']
        if (!token) {
            return res.status(403).send({message: 'Token not found'})
        } else {
            const tokenBody = token.slice(7)
            const decoded = jwt_decode(tokenBody)
            const u_id = decoded.payload.id
            const user = await db.member.findOne({where: {id: u_id}})
            if (user?.banned) {
                return res.status(403).send({message: 'You are blocked. Please contact admin'})
            }
            jwt.verify(tokenBody, process.env.JWT_SECRET, (error) => {
                if (error) {
                    return res.status(401).send({message: 'Access denied, expire token'})
                }
                next()
            })
        }
    }
}

const getUserIdFromToken = async (req) => {
    try {
        const token = req.header('authorization')
        const tokenBody = token.slice(7)
        const decoded = jwt_decode(tokenBody)
        const u_id = decoded.payload.id
        return u_id
    } catch (error) {
        return false
    }
}

const generateAccessTokenForPasswordRest = async (_payload) => {
    const payload = {id: _payload.id}
    return jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: '15m'})
}

// const verifyResetToken = (token) => {
//     console.log('token', token)
//     return async (req, res, next) => {
//         console.log(1)
//         if (!token) {
//             return res.status(403).send({message: 'Token not found'})
//         } else {
//             // const tokenBody = token.slice(7)
//             jwt.verify(token, process.env.JWT_SECRET, (error) => {
//                 if (error) {
//                     return res.status(401).send({message: 'Access denied, expire token'})
//                 }
//                 next()
//             })
//         }
//     }
// }

const verifyResetToken = (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(new Error('Token not found'))
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
                if (error) {
                    reject(new Error('Access denied, expired token'))
                } else {
                    resolve(decoded)
                }
            })
        }
    })
}

const getUserIdFromResetLink = async (token) => {
    try {
        const tokenBody = token.slice(7)
        const decoded = jwt_decode(tokenBody)
        const u_id = decoded.payload.id
        return u_id
    } catch (error) {
        return false
    }
}
export {generateAccessToken, verifyAuthToken, getUserIdFromToken, generateAccessTokenAutoLogin, generateAccessTokenForPasswordRest, verifyResetToken, getUserIdFromResetLink}
