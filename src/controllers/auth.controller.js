import { sendEmail } from "../utils/mail.util.js"
import ENVIROMENT from "../config/enviroment.config.js"
import User from "../models/user.model.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import UserRepository from "../repositories/user.repository.js"

export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)
            .setMessage ("bad request")
            .setPayload ({
                detail: "faltan datos"
            })
            .build()
            return res.status(400).json(response)
        }

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)
            .setMessage ("bad request")
            .setPayload ({
                detail: "el email ya esta registrado"
            })
            .build()
            return res.status(400).json(response)
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const verificationToken = jwt.sign ({email: email}, ENVIROMENT.JWT_SECRET, {
            expiresIn: '1d'
        })

        const url_verification =`${ENVIROMENT.URL_FRONT}/verify/${verificationToken}`

        await sendEmail({
            to: email,
            subject: 'verificacion de email',
            html:`
            <h1>Verificacion de email</h1>
            <p>Dale clic al boton de abajo para verificar tu email</p>
            <a href="${url_verification}"> Click aqui </a>
                `
            
        })

        const newUser = new User({
            name: name,
            email: email,
            password: hashPassword,
            emailVerified: false,
            verificationToken: verificationToken
        })
        
        const saveResult = await newUser.save()
        console.log("saveResult: ", saveResult)

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('created')
        .setPayload({})
        .build()
        res.status(201).json(response)

    } catch (error) {
        console.error('error al registrar usuario:', error)
        const response = new ResponseBuilder()
        .setOk (false)
        .setStatus (500)
        .setMessage ("internal server error")
        .setPayload ({
            detail: error.message
        })
        .build()
        return res.status(500).json(response)
    }
    
}

export const verifyMailValidationToken = async(req, res) => {
    try {
        const {verification_Token} = req.params
        if (!verification_Token) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)
            .setMessage ("bad request")
            .setPayload ({
                detail: "falta el token de verificacion"
            })
            .build()
            return res.json(response)
        }

        //Verifico la firma del Token, debe ser la misma que la clave secreta, controla que sea emitida desde mi server
        //Si falla la lectura o si expira el token, hara un throw en el catch
        //La constante decodedToken contiene el payload de mi token
        const decodedToken = jwt.verify(verification_Token, ENVIROMENT.JWT_SECRET)
        const user = await User.findOne({email: decodedToken.email})
        if (!user) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (404)
            .setMessage ("User not found")
            .setPayload ({
                detail: "Email not registered"
            })
            .build()
            return res.json(response)
        }
        if (user.emailVerified) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)
            .setMessage ("Email already verified")
            .setPayload ({
                detail: "Email already verified"
            })
            .build()
            return res.json(response)
        }
        user.emailVerified = true


        await user.save()
        const response = new ResponseBuilder()
        .setOk (true)
        .setMessage("Email verificado con exito")
        .setStatus (200)
        .setPayload ({
            message: "Usuario validado"
        })
        .build()
        res.json(response)
    }

    catch (error) {
        console.error(error)
    }
}

export const LoginController = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (404)
            .setMessage ("User not found")
            .setPayload ({
                detail: "Email not registered"
            })
            .build()
            return res.json(response)
        }

        if (!user.emailVerified){
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (403)
            .setMessage ("Forbidden")
            .setPayload ({
                detail: "Email not verified"
            })
            .build()
            return res.json(response)
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (401)
            .setMessage ("Unauthorized")
            .setPayload ({
                detail: "Password incorrect"
            })
            .build()
            return res.json(response)
        }

        const token = jwt.sign({
            email: user.email,
            id: user._id,
            role: user.role
            }, ENVIROMENT.JWT_SECRET, {expiresIn: '1d'})

        const response = new ResponseBuilder()
        .setOk (true)
        .setStatus (200)
        .setMessage ("Conectado")
        .setPayload ({
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
        .build()
        res.json(response)
    }

    catch (error) {
        const response = new ResponseBuilder()
        .setOk (false)
        .setStatus (500)
        .setMessage ("Internal server error")
        .setPayload ({
            detail: error.message
        })
        build()
        res.json(response)
    }
}

export const forgorPasswordController = async (req, res) => {
        try {
            const {email} = req.body
            //validacion
            const user = await UserRepository.getByEmail(email)
            if (!user) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (404)
                .setMessage ("User not found")
                .setPayload ({
                    detail: "Email not registered"
                })
                .build()
                return res.json(response)
            }

            const resetToken = jwt.sign({email: user.email, id: user._id}, ENVIROMENT.JWT_SECRET, {
                expiresIn: '1h'})

            const resetURL = `${ENVIROMENT.URL_FRONT}/reset-password/${resetToken}`

            sendEmail({
                to: user.email,
                subject: "Restablecer contraseña",
                html: 
                `
                <div>
                    <h1>Restablecer contraseña</h1>
                    <p>Para restablecer la contraseña haz clic en el siguiente enlace</p>
                    <a href="${resetURL}">Restablecer contraseña</a>
                </div>
                `
                
            })

            const response = new ResponseBuilder()
            .setOk (true)
            .setStatus (200)
            .setMessage ("Email enviado")
            .setPayload ({
                detail: "Email enviado"
            })
            .build()
            res.json(response)
        }

        catch (error) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (500)
            .setMessage ("Internal server error")
            .setPayload ({
                detail: error.message
            })
            .build()
            res.json(response)
        }
}
    
export const ResetTokenController = async (req, res) => {
    try{
        const {password} = req.body
        const {reset_token} = req.params

        if (!password) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)
            .setMessage ("Password required")
            .setPayload ({
                detail: "Password required"
            })
            .build()
            return res.json(response)
        }

        if (!reset_token) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)
            .setMessage ("Bad request")
            .setPayload ({
                detail: "Reset token expired or invalid"
            })
            .build()
            return res.json(response)
        }

        const decodedToken = jwt.verify(reset_token, ENVIROMENT.JWT_SECRET)
        if (!decodedToken) {
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (400)                
            .setMessage ("Bad request")
            .setPayload ({
                detail: "Failed to verify token"
            })
            .build()
            return res.json(response)
            }

            const {email} = decodedToken
            const user = await UserRepository.getByEmail(email)
            if (!user) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (404)
                .setMessage ("User not found")
                .setPayload ({
                    detail: "User not found"
                })
                .build()
                return res.json(response)
            }

        const encryptedPassword = await bcrypt.hash(password, 10)
        user.password = encryptedPassword
        await user.save()
        const response = new ResponseBuilder()
        .setOk (true)
        .setStatus (200)
        .setMessage ("Password updated")
        .setPayload ({
            detail: "Password updated"
        })
        .build()
        res.json(response)
        } 

    catch (error) {
        const response = new ResponseBuilder()
        .setOk (false)
        .setStatus (500)
        .setMessage ("Internal server error")
        .setPayload ({
            detail: ""
        })
        .build()
        res.json(response)
    }
}
