import twilio from 'twilio'
import dotenv from 'dotenv'
dotenv.config()

const sendSms = async (phone, code, createInComingCustomerId) => {
    try {
        if (phone && code) {
            let phoneNumber = phone.replace(/[- )+(]/g, '')
            phoneNumber = !phoneNumber.startsWith(1) ? '' + phoneNumber : '+' + phoneNumber
            phoneNumber = '+' + phoneNumber
            const msg = {body: `Your Property Website Link is https://ourhousetalks.vercel.app/details/${code}_${createInComingCustomerId}`, from: parseInt(process.env.SENDER_PHONE), to: phoneNumber}
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
         
            const sentMessage = await client.messages.create(msg)
            if (sentMessage) return true
        }
        return false
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const sendSmsAgent = async (phone, inquirerEmail, propertyId, propertyTitle, propertyAddress, ipAddress) => {
    try {
        if ((phone, propertyId, propertyTitle, propertyAddress, ipAddress)) {
            let phoneNumber = phone.replace(/[- )+(]/g, '')
            phoneNumber = !phoneNumber.startsWith(1) ? '' + phoneNumber : '+' + phoneNumber
            phoneNumber = '+' + '923017601131'
            const msg = {body: `you Recieved query for property id: ${propertyId} from ${inquirerEmail} the title:${propertyTitle} and the address:${propertyAddress} and IP:${ipAddress}`, from: parseInt(process.env.SENDER_PHONE), to: phoneNumber}
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
            const sentMessage = await client.messages.create(msg)
            if (sentMessage) return true
        }
        return false
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const sendSmsFreind = async (phone, code, email) => {
    try {
        if (phone && code) {
            let phoneNumber = phone.replace(/[- )+(]/g, '')
            phoneNumber = !phoneNumber.startsWith(1) ? '' + phoneNumber : '+' + phoneNumber
            phoneNumber = '+' + phoneNumber
            const msg = {body: `your freind ${email} sent you a property link and the Property Website Link is https://ourhousetalks.vercel.app/details/${code}`, from: parseInt(process?.env?.SENDER_PHONE), to: phoneNumber}
            const client = twilio(process?.env?.TWILIO_ACCOUNT_SID, process?.env?.TWILIO_AUTH_TOKEN)
            const sentMessage = await client?.messages?.create(msg)
            if (sentMessage) return true
        }
        return false
    } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}

const sendPromotionsSms = async (property,phone) => {
    try {
     
            const client = twilio(process?.env?.TWILIO_ACCOUNT_SID, process?.env?.TWILIO_AUTH_TOKEN)
            const messages = await Promise.all(
                phone.map(async (phoneNumber) => {
                  const message = await client?.messages?.create({
                    body: `Dear valued customer, we are excited to introduce our latest property located in your area. As one of our nearest and most valued customers, we wanted to extend an exclusive offer to you. Discover the perfect home at our new property and enjoy special promotions just for you!. Please vist the Property this is the Link:https://ourhousetalks.vercel.app/${property}`,
                    messagingServiceSid: "MG8a08b3434d174e1089196ecb80390ff6", 
                    to: '+'+phoneNumber,
                  });
                  return message;
                })
              );
          } catch (error) {
        return {
            status: false,
            message: error.message
        }
    }
}
export {sendSms, sendSmsFreind, sendSmsAgent,sendPromotionsSms}
