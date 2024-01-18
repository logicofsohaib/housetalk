import os from 'os'

export default {
    usersFetched: 'ok',
    serverError: 'Internal Server Error',
    validationErrors: 'Validation Errors'
}
export const getIpAddress = () => {
    const networkInterfaces = os.networkInterfaces()
    const ipv4Interfaces = networkInterfaces['Ethernet'] || networkInterfaces['Wi-Fi'] || []

    for (const iface of ipv4Interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address
        }
    }

    return 'Unknown'
}

export function getClientIP(req) {
    // If behind a proxy or load balancer, use the X-Forwarded-For header
    const forwardedFor = req.headers['x-forwarded-for']
    if (forwardedFor) {
        const ipList = forwardedFor.split(',')
        return ipList[0].trim()
    }

    // Otherwise, use the remoteAddress from the connection
    return req.connection.remoteAddress
}
