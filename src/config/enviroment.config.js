import dotenv from "dotenv";

dotenv.config()

const ENVIROMENT = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    URL_FRONT: process.env.URL_FRONT,
    API_KEY_INTERN: process.env.API_KEY_INTERN
}

export default ENVIROMENT