import nodemailer from "nodemailer"
const mailSender = (email,title, body) => {
    try {
        console.log(body)
        const transprter = nodemailer.createTransport({
            host:process.env.HOST_MAIL,
            auth: {
                user:process.env.HOST_USER,
                pass:process.env.HOST_PASS
            }
        });

            const info = transprter.sendMail({
                from: process.env.HOST_USER,
                to: `${email}`,
                subject:`${title}`,
                html:`Verify your account using the OTP: ${body}`
            })
            // console.log("info ",info)
            return info;
    } catch (error) {
        console.log("Error while Mailing: ",error)
    }
}
export default mailSender;