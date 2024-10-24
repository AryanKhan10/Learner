import {Category} from "../models/category.model.js"

const createCategory = async (req, res) => {
    try {
        const {name, description} = req.body;

        if(!name || !description){
           return res.status(400).json({
            success:false,
            message:"All fields are required.",
            }) 
        }

        const tag = await Category.create({name:name, description:description}, {new:true});

        res.status(200).json({
            success:true,
            message:"tag created successfully.",
            tag
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"something went wrong while creating tag.",
            error:error
        })
    }
}

const getAllCategory = async (req, res) => {

    try {
        const allTag = await Category.find({})
        res.status(200).json({
            success:true,
            message:"something went wrong while creating tag.",
            allTag
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"something went wrong while getting all tags.",
            error:error
        })
    }
}

const categoryPageDetails = async (req, res) => { 
    try { 
            //get categoryId 
            const {categoryId} = req.body; 

            //get courses for specified categoryId 
            const selectedCategory = await Category.findById(categoryId).populate("courses") .exec();

            //validation 
            if(!selectedCategory) { 
                return res.status(404).json({ 
                    success: false, 
                    message: 'Data Not Found', 
                }); 
            } 

            //get courses for different categories 
            const differentCategories = await Category.find({ _id: {$ne: categoryId} }).populate("courses") .exec();

            //get top selling courses //HW - write it on your own
            
            // return response
            return res.status (200).json({
                success:true,
                data: { 
                    selectedCategory, 
                    differentCategories, 
                }
            });
    }catch(error){
        res.status (500).json({
            success:false,
            error,
        });
    }
}

export {createCategory, getAllCategory, categoryPageDetails}