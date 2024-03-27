

const {MouseType} = require("../../models") 


const checkMouseType = async (req,res,next) =>{
    try{
        const name_type = req.body.name
        const checkType = await MouseType.find({name_type : name_type});
        if(checkType.length >= 1) {
            res.json({
                message:`Đã có loại chuột ${checkType.name} này rồi!!`
            })
        }
        next()
    }
    catch(err) {
        res.status(500).json({
            message:"Lỗi kết nối vui lòng thử lại sau !!!",
            error:err
        })
    }
}
const checkIdMouseType  = async(req,res,next)=>{
    try{
        const id = req.query.id
        const checkID = await MouseType.find({_id : id})
        if(checkID.length === 0){
            res.json({
                message:"Không có tìm thấy loại chuột có ID là : " + id,
            })
        }
        next();
    }
    catch(err){
        res.status(500).json({
            message:"Lỗi kết nối vui lòng thử lại sau !!!",
            error:err
        })
    }
}
module.exports = {checkMouseType,checkIdMouseType}