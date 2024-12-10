import mongoose from "mongoose";
import ENVIROMENT from "../config/enviroment.config.js";

mongoose.connect(ENVIROMENT.DB_URL)
.then(
    ()  => {
        console.log("conectado a la base de datos") 
    } 
)
.catch(
    (error) => {
        console.error('error de conexion')
    }
)

export default mongoose