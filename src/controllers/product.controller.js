import { get } from "mongoose"
import ProductRepository from "../repositories/product.repository.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"

export const getAllProductsController = async (req, res) => {
try{
        const productsFromDb = await ProductRepository.getAllProducts()
        const products = productsFromDb.map(product => {
            return {
                ...product._doc, 
                id: product._id,
            }
        })

        if(!products){
            const response = new ResponseBuilder()
            .setOk (false)
            .setStatus (404)
            .setMessage ("Products not found")
            .setPayload ({
                detail: "Products not found"
            })
            .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()  
        .setOk (true)
        .setStatus (200)
        .setMessage ("Productos obtenidos")
        .setPayload ({
            products
        })
        .build()
        return res.json(response)
    }
    catch(error){
        console.log(error)
    }
}

export const getProductByIdController = async (req, res) => {
        try{
            const {product_id} = req.params
            const product_found = await ProductRepository.getProductById(product_id)
            console.log(product_found._id)

            if (!product_found) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (404)
                .setMessage ("Product not found")
                .setPayload ({
                    detail: `Product with id ${product_id} does not exist`
                })
                .build()
                return res.status(404).json(response)
            }

            const response = new ResponseBuilder()
            .setOk (true)
            .setStatus (200)
            .setMessage ("Product obtained")
            .setPayload ({
                product: product_found
            })
            .build()
            return res.json(response)
        }
        catch(error){
            console.error(error.messsage)
    }
}

export const createProductController = async (req, res) => {
        try{
            const {title, description, price, stock, category, image} = req.body
            const seller_id = req.user.id
            console.log(seller_id)
            console.log(req.headers)
            if (!title){
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({
                    detail: "Title is required"
                })
                .build()
                return res.status(400).json(response)
            }

            if (!description){
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({
                    detail: "Description is required"
                })
                .build()
                return res.status(400).json(response)
            }

            if (!price || price <= 0 || isNaN (price)) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({
                    detail: "Price must be a number greater than zero"
                })
                .build()
                return res.status(400).json(response)
            }

            if (!stock || stock <= 0 || isNaN (stock)) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({
                    detail: "Stock must be a number greater than zero"
                })
                .build()
                return res.status(400).json(response)
            }

            if (!category) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({    
                    detail: "Category is required"})
                .build()
                return res.status(400).json(response)
            }

            if(!seller_id) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({
                    detail: "Seller id is required"
                })
                .build()
                return res.status(400).json(response)
            }

            if(image.toString()  > 2 * 1024 * 1024){
                console.error('Imagen muy grande')
                return res.sendStatus(400)
            }

            const newProduct = {
                title,
                price,
                stock,
                description: description,
                category,
                image: image.toString(),
                seller_id
            } 

            

            const newProductSaved = await ProductRepository.createProduct(newProduct)
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Product Created')
            .setPayload(
                {
                    data: {
                        title: newProductSaved.title,
                        price: newProductSaved.price,
                        stock: newProductSaved.stock,
                        descripcion: newProductSaved.descripcion,
                        category: newProductSaved.category,
                        id: newProductSaved._id
                    }
                }
            )
            .build()
        res.json(response)
    }

        catch(error){
            console.error(error.messsage)
        }
    }

export const updateProductController = async (req, res) => {
        try{
            const {product_id} = req.params
            const {title, description, price, stock, category} = req.body

            if (!title|| !description || !price || !category || !stock) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (400)
                .setMessage ("Bad request")
                .setPayload ({
                    detail: "Data Required"
                })
                .build()
                return res.status(400).json(response)
            }

            const new_product_data = {
                title: title,
                description: description,
                price: price,
                stock: stock,
                category: category
            }

            const product_updated = await ProductRepository.updateProduct(product_id, new_product_data)


            const response = new ResponseBuilder()
                .setOk (true)
                .setStatus (200)
                .setMessage ("Product updated")
                .setPayload ({
                    product: product_updated
                })
                .build()

            return res.json(response)
        }

        catch(error){
            console.error(error.messsage)
        }
    }


export const deleteProductController = async (req, res) => {
        try{
            const {product_id} = req.params
            const product_deleted = await ProductRepository.deleteProduct(product_id)

            if (!product_deleted) {
                const response = new ResponseBuilder()
                .setOk (false)
                .setStatus (404)
                .setMessage ("Product not found")
                .setPayload ({
                    detail: `Product with id ${product_id} does not exist`
                })
                .build()
                return res.status(404).json(response)
            }

            const response = new ResponseBuilder()
            .setOk (true)
            .setStatus (200)
            .setMessage ("Product deleted")
            .setPayload ({
                product: product_deleted
            })
            .build()
            return res.json(response)
        }

        catch{
            console.error(error.messsage)
        }
}
