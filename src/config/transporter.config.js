import nodemailer from "nodemailer"
import ENVIROMENT from "./enviroment.config.js"
/* Logica de configuracion del email */

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: ENVIROMENT.GMAIL_USERNAME,
        pass: ENVIROMENT.GMAIL_PASS
    }
})

export default transporter