import express from "express";
import { verifyTokenMiddleware } from "../middlewares/auth.middleware.js";
import { createProductController,
        deleteProductController, 
        getAllProductsController, 
        getProductByIdController, 
        updateProductController } 
        from "../controllers/product.controller.js";

const productsRouter = express.Router();


productsRouter.get('/', verifyTokenMiddleware(), getAllProductsController)
productsRouter.get('/:product_id', verifyTokenMiddleware(), getProductByIdController)
productsRouter.post('/', verifyTokenMiddleware(['seller', 'admin', 'user'] ), createProductController)
productsRouter.put('/:product_id', verifyTokenMiddleware(['seller', 'admin', 'user'] ), updateProductController)
productsRouter.delete('/:product_id', verifyTokenMiddleware(['seller', 'admin', 'user'] ), deleteProductController)

export default productsRouter