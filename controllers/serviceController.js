import Service from "../models/Service.js";

const createService = async (req,res)=>{

try{
console.log("Create service request body:", req.body);
console.log("Create service file:", req.file);
console.log("Create service user:", req.user);

const {name, price, category} = req.body;
const numericPrice = parseFloat(price);

if(!name || isNaN(numericPrice)){
  return res.status(400).json({
    message: "Valid name and numeric price are required"
  });
}

if(!req.user || !req.user.id){
  return res.status(401).json({
    message: "Unauthorized: User ID missing from token"
  });
}
  
const imagePath = req.file ? req.file.path : null;

if(!imagePath){
  return res.status(400).json({
    message: "Service image is required"
  });
}

console.log("Attempting to create service with:", {
  saloon_id: req.user.id,
  name,
  price: numericPrice,
  serviceImg: imagePath,
  category: category || 'Haircut'
});

const service = await Service.create({
  saloon_id: req.user.id,
  name,
  price: numericPrice,
  serviceImg: imagePath,
  category: category || 'Haircut'
});

res.status(201).json({
  message: "Service created successfully",
  service
});

}catch(error){
console.error("Create service error:", error);
res.status(500).json({
message:error.message || "Internal server error during service creation",
error: JSON.stringify(error, Object.getOwnPropertyNames(error))
})
}

}

const getServices = async (req,res)=>{

try{

// Use authenticated user's ID from middleware
const saloonId = req.user.id;

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


const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category } = req.body;
    const saloonId = req.user.id;

    if (!name || isNaN(parseFloat(price))) {
      return res.status(400).json({
        message: "Valid name and numeric price are required"
      });
    }

    const service = await Service.findOne({
      where: { id, saloon_id: saloonId }
    });

    if (!service) {
      return res.status(404).json({
        message: "Service not found or unauthorized"
      });
    }

    await service.update({
      name,
      price: parseFloat(price),
      category: category || service.category
    });

    res.status(200).json({
      message: "Service updated successfully",
      service
    });

  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({
      message: error.message || "Internal server error during service update",
      error: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const { saloon_id } = req.query;
    const whereClause = saloon_id ? { saloon_id } : {};
    const services = await Service.findAll({ where: whereClause });
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {createService, getServices, updateService, getAllServices}
