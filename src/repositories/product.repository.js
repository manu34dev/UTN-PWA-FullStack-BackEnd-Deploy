import Product from "../models/product.model.js";

class ProductRepository {
    static async getAllProducts() {
        //Obtener lista de productos activos
        return Product.find({active: true})
    }

    static async getProductById(id) {
        return Product.findById(id)
    }

    static async createProduct(product_data) {
        const new_product = new Product(product_data)
        return new_product.save()
    }

    static async updateProduct(id, new_product_data) {
        return Product.findByIdAndUpdate(id, new_product_data, {new: true})
    }

    static async deleteProduct(id) {
        return Product.findByIdAndUpdate(id, {active: false}, {new: true})
    }

}

export default ProductRepository