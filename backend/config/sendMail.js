import nodemailer from "nodemailer";

const sendMail = async ({email, subject, html})=>{


const transport = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const receiver = {
    from : "heymanishthakur@gmail.com",
    to : email,
    subject,
    html
}

    await transport.sendMail(receiver,(error, mailresponse)=>{
    if(error){
        console.log("error occur in sending the mail")
        throw error;
    }
    console.log("mail success");
    return mailresponse;
});
}
export default sendMail;