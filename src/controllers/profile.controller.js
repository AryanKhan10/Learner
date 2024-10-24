import {Profile} from "../models/profile.model.js";
import {User} from "../models/user.model.js";
import fileUpload from "../utiles/fileUpload.js";

// create is leye nai kr rahe kiu k user signup krte hue hi hm ne os ki profile ko null kr deya tha
const updateProfile = async (req, res) => {
  try {
    const { gender = "", dateOfBirth = "", about, contactNumber } = req.body;

    // profile ki id k base pe update krna hai pr id sirf user ki hai
    // tho user schema se profile ki id nikal k profile updaye karengy
    const userId = req.user.id;

    const user = await User.findById({ _id: userId });
    const updatedProfile = await Profile.findByIdAndUpdate(
      { _id: user.additionalDetails },
      {
        gender: gender,
        dateOfBirth: dateOfBirth,
        about: about,
        contactNumber: contactNumber,
      }
    );

    res.status(200).json({
      success: true,
      message: "profile updated successfully.",
      updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the prpfile.",
      error: error,
    });
  }
};


const deleteAccount = async (req, res) => {
    try {
        //get user id
        //validate
        // delete profile first
        // delete user and return res

        const id = req.user.id

        const user = User.findById(id)

        if(!user){
            res.status(404).json({
                success: false,
                message: "User not found.",
              });
        }
        //dlt profile
        await Profile.findByIdAndDelete({_id: user.additionalDetails})
        // dlt fron enrolled users
        //dlt user
        await User.findByIdAndDelete({_id: id})
        
        res.status(200).json({
            success: true,
            message: "Account deleted successfully.",
          });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Account.",
            error: error,
          });
    }
}
const updateProfilePic = async (req, res)=>{
  try {
    const file= req.files.file;
    if(!file){
      return res.status(404).json({
        success: false,
        message: "File not Found."
      })
    }

    const response = await updateProfile(file, process.env.FOLDER);
    console.log(response)
    res.status(200).json({
      success: true,
      message: "Updated Profile Picture.",
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Couldn't update Profile Picture.",
      error:error
    })
  }
}
export { updateProfile, deleteAccount, updateProfilePic };
