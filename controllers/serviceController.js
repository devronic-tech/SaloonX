import Service from "../models/Service.js";

// ✅ GET SINGLE SERVICE
const getService = async (req,res)=>{
try{
const {id} = req.params;

const service = await Service.findOne({
where:{ id }
});

if(!service){
return res.status(404).json({ message:"Service not found" });
}

res.json({ service });

}catch(error){
res.status(500).json({ message:error.message })
}
};


const createService = async (req,res)=>{
try{

const {name,price,category} = req.body;

if(!name || isNaN(parseFloat(price))){
return res.status(400).json({
message:"Valid name and price required"
})
}

const images = req.file ? [req.file.path] : [];

if(images.length === 0){
return res.status(400).json({
message:"Image required"
})
}

const service = await Service.create({

owner_id: req.user.id,
salon_id: req.user.salon_id,

name,
price: parseFloat(price),
serviceImg: images,
category: category || "Haircut"

});

res.status(201).json({
message:"Service created",
service
});

}catch(error){
res.status(500).json({ message:error.message })
}
};


const getServices = async (req,res)=>{
try{

const services = await Service.findAll({
where:{ owner_id: req.user.id }
});

res.json({ services });

}catch(error){
res.status(500).json({ message:error.message })
}
};


// ✅ GET ALL SERVICES (Public)
const getAllServices = async (req,res)=>{
try{

const services = await Service.findAll();

res.json({ services });

}catch(error){
res.status(500).json({ message:error.message })
}
};


// ✅ UPDATE SERVICE
const updateService = async (req,res)=>{
try{

const {id} = req.params;
const {name, price, category} = req.body;

const service = await Service.findOne({
where:{ id, owner_id: req.user.id }
});

if(!service){
return res.status(404).json({ message:"Service not found" });
}

if(name) service.name = name;
if(price) service.price = parseFloat(price);
if(category) service.category = category;

await service.save();

res.json({
message:"Service updated",
service
});

}catch(error){
res.status(500).json({ message:error.message })
}
};

export { createService, getServices, getAllServices, updateService, getService };