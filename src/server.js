import ENVIROMENT from "./config/enviroment.config.js";
import express, { text } from "express"
import statusRouter from "./router/status.router.js";
import authRouter from "./router/auth.router.js";
import configDb from "./db/config.js";
import cors from "cors"
import productsRouter from "./router/products.router.js";
import { verifyApikeyMiddleware } from "./middlewares/auth.middleware.js";


const app = express();
const PORT = ENVIROMENT.PORT || 3000

app.use(cors())
app.use(express.json({limit: '5mb'}))
app.use(verifyApikeyMiddleware)


app.use ('/api/status', statusRouter) 
app.use ('/api/auth', authRouter)
app.use ('/api/products', productsRouter)



app.listen(PORT, () => {
    console.log(`el servidor se esta ejecutando en http://localhost:${PORT}`);
})