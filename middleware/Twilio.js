// this informations are sensitive and stored in .env file

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN; // Your Auth Token from www.twilio.com/console
const serviceSid = process.env.TWILIO_SERVICE_SID; // My Service SID from www.twilio.com/console
const client = require('twilio')(accountSid, authToken)



// api for sending otp to the user mobile number....
   const  generateOpt= (mobileNo) => {
        return new Promise((resolve, reject) =>{
            client.verify
            .services(serviceSid)
            .verifications
            .create({
                to : `+91${mobileNo}`,
                channel :'sms'
            })
            .then((verifications) => {
               resolve(verifications.sid)  
            });
        })
        
    }
// api for verifying the otp recived by the user 
    const verifyOtp =(mobileNo,otp) =>{
        console.log(mobileNo,otp)
        return new Promise((resolve, reject) =>{
            client.verify
            .services(serviceSid)
            .verificationChecks
            .create({
                to : `+91${mobileNo}`,
                code : otp
            })
            .then((verifications) => {
               resolve(verifications)
            })
        })
    }
module.exports={generateOpt,verifyOtp}