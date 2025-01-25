import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
// need SMTP details to send the email. can be use any smtp provider
host:'smtp-relay.brevo.com', //from SMTP Server
port:587,
auth:{
    user:process.env.SMTP_USER,
    pass:process.env.SMTP_PASS,
}

});

export default transporter;