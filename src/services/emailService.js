import dotenv from 'dotenv'
dotenv.config()
import sgMail from '@sendgrid/mail'
import moment from 'moment'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendPropertyIdEmail = async (propertyId, email, propertyTitle, propertyAddress,incomingId,emailsms10,emailsms30,emailsms40,membername,company,phone,memberemail) => {
    var pacific    = moment.tz("US/Pacific");
    var canada = pacific.clone().tz("Canada/Eastern"); 

    console.log(pacific.format('hh:mm A'));
    console.log(canada.format('hh:mm A'));
    const msg = {
        to: email,
        from: {
            name: 'HouseTalk ',
            email: 'noreply@ourhousetalk.com'
        },
        subject: 'Welcome',
        text: `Your query recieved at verticalsols`,
        html: `<div class="nH aHU">
        <div class="nH hx">
           <div class="nH"></div>
        </div>
        <div class="nH"></div>
        <div class="nH">
        <div class="h7 ie nH oy8Mbf" role="listitem" aria-expanded="true" tabindex="-1">
        <div class="Bk">
        <div class="G3 G2">
        <div>
        <div id=":my">
        <div class="adn ads" style="display:" data-message-id="#msg-f:1775568780109575075" data-legacy-message-id="18a41665ecb473a3">
        <div class="aju">
        <div class="aCi">
           <div class="aFg" style="display: none;"></div>
           <div class="gs">
              <div class="gE iv gt">
                 <table cellpadding="0" class="cf gJ">
                 <tbody>
                    <tr class="acZ">
                       <td class="gF gK">
                          <table cellpadding="0" class="cf ix">
                             <tbody>
                                <tr>
                                   <td class="gH"></td>
                                   <td class="gH acX bAm" rowspan="2">
                                      <div class="T-I J-J5-Ji T-I-Js-IF aaq T-I-ax7 L3" role="button" tabindex="0" jslog="21576; u014N:cOuCgd,Kr2w4b; 1:WyIjdGhyZWFkLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXSxudWxsLDEsMF0." data-tooltip="Reply" aria-label="Reply" style="user-select: none;"><img class="hB T-I-J3 " role="button" src="images/cleardot.gif" alt=""></div>
                                      <div id=":ne" class="T-I J-J5-Ji T-I-Js-Gs aap T-I-awG T-I-ax7 L3" role="button" tabindex="0" aria-expanded="false" aria-haspopup="true" data-tooltip="More" aria-label="More" style="user-select: none;"><img class="hA T-I-J3" role="menu" src="images/cleardot.gif" alt=""></div>
                                   </td>
                                </tr>
                                <tr class="acZ xD">
                                   <td colspan="3">
                                      <table cellpadding="0" class="cf adz">
                                         <tbody>
                                            <tr>
                                               <td class="ady">
                                                  <div class="iw ajw"></div>
                                                  <div id=":nd" aria-haspopup="true" class="ajy" role="button" tabindex="0" data-tooltip="Show details" aria-label="Show details"><img class="ajz" src="images/cleardot.gif" alt=""></div>
                                               </td>
                                            </tr>
                                         </tbody>
                                      </table>
                                   </td>
                                </tr>
                             </tbody>
                          </table>
              </div>
              <div id=":mz"><div class="qQVYZb"></div><div class="utdU2e"></div><div class="lQs8Hd" jsaction="SN3rtf:rcuQ6b" jscontroller="i3Ohde"></div><div class="btm"></div></div><div class=""><div class="aHl"></div><div id=":nc" tabindex="-1"></div><img src="https://i.ibb.co/807J1g3/htlogom.png" alt="" height="122" width="500" data-image-whitelisted="" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 373px; top: 102.5px;"><div id=":o6" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment htlogom.png" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXV0." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div><div id=":o7" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Add attachment to Drive htlogom.png" jslog="54185; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXV0.; 43:WyJpbWFnZS9wbmciLDIyOTA1XQ.." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Add to Drive"><div class="akn"><div class="wtScjd J-J5-Ji aYr XG"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div><div id=":o9" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Save to Photos" jslog="54186; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXV0.; 43:WyJpbWFnZS9wbmciLDIyOTA1XQ.." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Save to Photos"><div class="akn"><div class="J-J5-Ji aYr akS"><div class="T-aT4" style="display: none;"><div></div><div class="T-aT4-JX"></div></div></div></div></div></div><br>Hello,<br><br><b>${emailsms10}</b><br>Property ID: ${propertyId}<br>Property Title: ${propertyTitle}<br>Property Address: ${propertyAddress}<br><br>Please <a href="https://ourhousetalks.vercel.app/details/${propertyId}_${incomingId}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.ourhousetalk.com/infomap.php?vid%3D4569&amp;source=gmail&amp;ust=1693400761702000&amp;usg=AOvVaw1fUQCEHHamrxeccl-JeGDT">Open</a> link for the property you requested.<br>If link above is not active, copy and paste this link into your mobile browser:<br><a href="https://ourhousetalks.vercel.app/details/${propertyId}_${incomingId}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.ourhousetalk.com/infomap.php?vid%3D4569&amp;source=gmail&amp;ust=1693400761702000&amp;usg=AOvVaw1fUQCEHHamrxeccl-JeGDT">https://ourhousetalks.vercel.app/<wbr>details/${propertyId}_${incomingId}</a><br><br>Email/Tel you provided: <a href="mailto:${email}" target="_blank">${email}</a><br><b>${emailsms30}</b><br><br><b>${emailsms40}</b><br><br>${membername}<br>${company}<br>Tel: ${phone}<br>Email: ${memberemail}<div class="yj6qo"></div><div class="adL"><br><br><br></div></div><div class="adL">
              </div>
           </div>
        </div>
        
        `
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendEmailToFreind = async (propertyId, email,friend, propertyTitle, propertyAddress, ipAddress, reffrer,emailsms30,emailsms40,membername,company,phone,memberemail) => {
 
    
    const msg = {
        to: email,
        from: {
            name: 'HouseTalk ',
            email: 'noreply@ourhousetalk.com'
        },
        subject: 'Welcome',
        text: `Your query recieved at verticalsols`,
        html: `<div class="a6S" dir="ltr" style="opacity: 0.01; left: 373px; top: 102.5px;">
        <div id=":o6" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment htlogom.png" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXV0." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Download">
            <div class="akn">
                <div class="aSK J-J5-Ji aYr"></div>
            </div>
        </div>
        <div id=":o7" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Add attachment to Drive htlogom.png" jslog="54185; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXV0.; 43:WyJpbWFnZS9wbmciLDIyOTA1XQ.." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Add to Drive">
            <div class="akn">
                <div class="wtScjd J-J5-Ji aYr XG">
                    <div class="T-aT4" style="display: none;">
                        <div></div>
                        <div class="T-aT4-JX"></div>
                    </div>
                </div>
            </div>
        </div>
        <div id=":o9" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Save to Photos" jslog="54186; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsW11d; 4:WyIjbXNnLWY6MTc3NTU2ODc4MDEwOTU3NTA3NSIsbnVsbCxbXV0.; 43:WyJpbWFnZS9wbmciLDIyOTA1XQ.." data-tooltip-class="a1V" jsaction="JIbuQc:.CLIENT" data-tooltip="Save to Photos">
            <div class="akn">
                <div class="J-J5-Ji aYr akS">
                    <div class="T-aT4" style="display: none;">
                        <div></div>
                        <div class="T-aT4-JX"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
   <br>This Property of Internest sent by ${friend}  of who sent it<br>
    
    Hello,
    Your friend has sent you a HouseTalk audio link for:<br>Property ID: ${propertyId}<br>Property Title: ${propertyTitle}<br>Property Address: ${propertyAddress}<br><br>Please <a href="https://ourhousetalks.vercel.app/details/${propertyId}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.ourhousetalk.com/infomap.php?vid%3D4569&amp;source=gmail&amp;ust=1693400761702000&amp;usg=AOvVaw1fUQCEHHamrxeccl-JeGDT">Open</a> link for the property you requested.<br>If link above is not active, copy and paste this link into your mobile browser:<br><a href="https://ourhousetalks.vercel.app/details/${propertyId}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.ourhousetalk.com/infomap.php?vid%3D4569&amp;source=gmail&amp;ust=1693400761702000&amp;usg=AOvVaw1fUQCEHHamrxeccl-JeGDT">https://ourhousetalks.vercel.app/<wbr>details/${propertyId}</a><br><br>Email/Tel you provided: <a href="mailto:${email}" target="_blank">${email}</a>to ${reffrer}<br>IP:${ipAddress}<br><br>${emailsms30}<br><br>${emailsms40}<br><br>${membername}<br>${company}<br>Tel: ${phone}<br>Email: ${memberemail}
    <div class="yj6qo"></div>
    <div class="adL"><br><br><br></div>
    </div>
    <div class="adL">
    </div>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const verificationCodeEmail = async (propertyId, email) => {
    const msg = {
        to: email,
        from: 'ukhanba@gmail.com',
        subject: 'Verification',
        html: `<div>
        <h1 style="backgroundColor":"red">Your account verification code is http://localhost:3000/details/${propertyId}</h1>
        </div>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const resetPasswordEmail = async (resetToken, email) => {
    const link = `${process.env.BASE_URL}/reset_password/${resetToken}`
    console.log('link', link)
    const msg = {
        to: email,
        from: {
            name: 'HouseTalk ',
            email: 'noreply@ourhousetalk.com'
        },
        subject: 'Resret Password',
        text: `Reset your password by clicking on this link ${link}`,
        html: `<strong>Reset your password by clicking on this link ${link}</strong>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const newPasswordEmail = async (email, code) => {
    const msg = {
        to: email,
        from: 'ukhanba@gmail.com',
        subject: 'Reset password',
        text: `Your account new password is ${code}. Use this password to login`,
        html: `<strong>Your account new password is ${code}. Use this password to login</strong>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const recievedEmailToClient = async (propertyId, email, propertyTitle, propertyAddress, ipAddress) => {
    const msg = {
        to: 'ukhanba@gmail.com',
        from: {
            name: 'HouseTalk ',
            email: 'noreply@ourhousetalk.com'
        },
        subject: 'Welcome',
        text: `Your account new password is . Use this password to login`,
        html: `<strong>We Recieved query for property id: ${propertyId} from ${email} the title:${propertyTitle} and the address:${propertyAddress} and IP:${ipAddress}. Use this password to login</strong>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const sendPropertyIdEmailAgent = async (propertyId, email, propertyTitle, propertyAddress, ipAddress,agentEmail) => {
   // console.log("propertyIdpropertyIdpropertyIdpropertyIdpropertyIdpropertyIdpropertyIdpropertyIdpropertyIdpropertyId",propertyId, email, propertyTitle, propertyAddress, ipAddress,agentEmail)
    const msg = {
        //to: `${agentEmail}`,
        to: `raojanay@gmail.com `,
        from: {
            name: 'HouseTalk ',
            email: 'noreply@ourhousetalk.com'
        },
        subject: 'Welcome',
        text: `Your account new password is . Use this password to login`,
        html: `<strong>you Recieved query for property id: ${propertyId} from ${email} the title:${propertyTitle} and the address:${propertyAddress} and IP:${ipAddress}.</strong>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

const adminResetUserPassword = async (email, code) => {
    const msg = {
        to: email,
        from: {
            name: 'HouseTalk ',
            email: 'noreply@ourhousetalk.com'
        },
        subject: 'Reset password',
        text: `Your account new password is ${code}. Use this password to login`,
        html: `<strong>Your account new password is ${code}. Use this password to login</strong>`
    }
    await sgMail
        .send(msg)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        })
}

// const sendPromotions=async(property,emails,description)=>{
//     const msg = {
//         to: emails,
//         from: {
//             name: 'HouseTalk ',
//             email: 'noreply@ourhousetalk.com'
//         },
//         subject: 'Show Promotions',
//         text: `This is Property Promotions`,
//         html: `${description}`
//     }
//     await sgMail
//         .send(msg)
//         .then((response) => {
//             console.log(response[0].statusCode)
//             console.log(response[0].headers)
//         })
//         .catch((error) => {
//             console.error(error)
//         })
// }

const sendPromotions = async (property, emails, description) => {
    const formattedDescription = description.replace(/\n/g, '<br>');
    
    const msg = {
      to: emails,
      from: {
        name: 'HouseTalk ',
        email: 'noreply@ourhousetalk.com',
      },
      subject: 'Show Promotions',
      text: 'This is Property Promotions',
      html: formattedDescription,
    };
  
    await sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
export {sendPropertyIdEmail, resetPasswordEmail, newPasswordEmail, verificationCodeEmail, recievedEmailToClient, sendEmailToFreind, adminResetUserPassword, sendPropertyIdEmailAgent,sendPromotions}
