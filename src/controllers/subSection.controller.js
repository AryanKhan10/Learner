import { Section } from "../models/section.model.js";
import { SubSection } from "../models/subSection.model.js";

const createSubSec = async (req,res) => {
    try {
        const {title,description,timeDuration,sectionId} = req.body;
        const vedio = req.body.file;

        if(!title || !timeDuration || !description || !vedio || sectionId ){
            return res.status(401).json({
                success:false,
                message:"All fields are required.",
            })
        }
        //upload vedio
        const uploadDetails = await fileUpload(vedio, process.env.FOLDER)
        //create section
        const subSection = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoURL:uploadDetails.secure_url
        });

        const section = await Section.findByIdAndUpdate(sectionId,
                                                        {$push:
                                                            {subSection:subSection._id}})

        res.status(200).json({
            success:true,
            message:"SubSection created successfully.",
            course
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while creating section.",
            error:error
        })
    }
}

const updateSubSec = async (req,res) => {
    try {
        const {title,description,timeDuration,subSectionId} = req.body;
        const vedio = req.body.file;

        if(!title || !timeDuration || !description || !vedio || !subSectionId){
            return res.status(401).json({
                success:false,
                message:"All fields are required.",
            })
        }
        
        const uploadDetails = await fileUpload(vedio, process.env.FOLDER)
        //update subsection
       const subsection = await SubSection.findByIdAndUpdate({_id:subSectionId},
                                            {title,description,timeDuration,videoURL:uploadDetails.secure_url},
                                        {new:true})
        res.status(200).json({
            success:true,
            message:"SubSection updated successfully.",
            subsection
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while creating section.",
            error:error
        })
    }
}

const deleteSubSec = async (req,res) => {
    try {
        const {subSectionId} =  req.params;

        //delete subsec
        await SubSection.findByIdAndDelete(subSectionId)

        //pull out subsec from section schema
        await Section.updateOne({subSection:subSectionId},{$pull:{subSection:subSectionId}})
        res.status(200).json({
            success:true,
            message:"Section deleted successfully.",
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while deleting the Subsection.",
            error:error
        })
    }
}

export {createSubSec, updateSubSec, deleteSubSec}