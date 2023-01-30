
export const responce=({res,code=200,message='',data={}})=>{
    res.status(code).json({
        message,
        data
    })
}