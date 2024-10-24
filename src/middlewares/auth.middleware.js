import jwt from "jsonwebtoken"
//auth 
const auth = async (req, res, next) => {
    try {
        // extract token
        const token = req.body.token || req.cookie.token || req.header["authentication"].replace("Bearer ",""); 

        //verify token 
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token does not provided.",
            })
        }

        try {
            const payload = jwt.verify(token, process.env.SECRET_KEY);
            req.user=payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Token is invalid.",
            })
        }
        next();
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong while verifying token.",
            error:error
        })
    }
    

}

//student
const isStudent = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"route for student.",
            })

        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Not a student.",
            error:error
        })
    }
} 

//admin
const isAdmin = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"route for admin.",
            })

        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Not an Admin.",
            error:error
        })
    }
} 

//instructor
const isInstructor = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"route for instructor.",
            })

        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Not an Instructor.",
            error:error
        })
    }
} 

export {auth, isAdmin, isInstructor, isStudent};