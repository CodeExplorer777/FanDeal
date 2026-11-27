const Product = require("../models/productModel");


//#region ADD PRODUCT
const addProduct = async (req, res) => {
    try{
        const {name, category, price} = req.body;

        if(!name || !category || !price === undefined){
            return res.status(400).json({
                message: "All Fields are required!"
            });            
        }

        if(!["Burger", "Side", "Drink"].includes(category)){
            return res.status(400).json({
                message: "Invalid Product Category!"
            });  
        }

        if(!Number.isFinite(Number(price)) || price < 0){
              return res.status(400).json({
                message: "Invalid Product Price!"
            });  
        }

        if(!req.file){
            return res.status(400).json({
                message: "Image file is required!"
            });  
        }


        const product = await Product.create({
            product_name: name.trim(),
            product_category: category,
            image_url: `/uploads/${req.file.filename}`,
            product_price: price
        });

        res.status(201).json({
            message: "Product Added Successfully!"
        });
    }
    catch(error){
        res.status(500).json({
            message: "Failed to Fetch Products",
            error: error.message
        });
    }
};
//#endregion


//#region GET ALL PRODUCTS
const getProducts = async(req, res)=>{
    try{
        const products = await Product.find().sort({
            createdAt: -1
        });
         res.status(200).json({
            message: "Products Fetched Successfully!",
            count: products.length,
            products
        });

    }
    catch(error){
         res.status(500).json({
            message: "Failed to Fetch Products",
            error: error.message
        });
    }
}
//#endregion

module.exports={
    addProduct, getProducts
}