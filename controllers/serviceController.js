import Service from "../models/Service.js";

const createService = async (req,res)=>{

try{

const {name,price} = req.body

if(!name || !price){
return res.status(400).json({
message:"All fields required"
})
}
  
const images = req.file ? req.file.filename : null

if(!images){
  return res.status(400).json({
    message: "Service image is required"
  })
}

const service = await Service.create({
 
saloon_id:req.user.id,
name,
price,
serviceImg:images
})

res.status(201).json({

message:"Service created successfully",
service

})

}catch(error){

res.status(500).json({
message:error.message
})

}

}

const getServices = async (req,res)=>{

try{

const { saloonId } = req.body;

if(!saloonId){
return res.status(400).json({
message:"Saloon ID is required"
})
}
               
const services = await Service.findAll({
where:{saloon_id:saloonId}
})
console.log(services)
res.json({
services
})

}catch(error){
      console.log(error.message)
res.status(500).json({
message:error.message
})

}

}

export {createService,getServices}
