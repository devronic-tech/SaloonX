import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";


// ✅ CREATE BOOKING
const createBooking = async (req,res)=>{
try{

const {date,time_slot} = req.body;
const {serviceId} = req.params;

// 🔥 logged-in user
const user = await User.findOne({
where:{ id: req.user.id }
});

if(!user){
return res.status(404).json({ message:"User not found" });
}

const user_name = user.name;
const user_phone = user.phone_number;

// 🔥 service
const service = await Service.findOne({
where:{ id: serviceId }
});

if(!service){
return res.status(404).json({ message:"Service not found" });
}

// prevent double booking
const existing = await Booking.findOne({
where:{
service_id: serviceId,
date,
time_slot,
status:["pending","accepted"]
}
});

if(existing){
return res.status(400).json({
message:"Slot already booked"
});
}

// 🔥 create booking
const booking = await Booking.create({

service_id: service.id,
service_name: service.name,
salon_id: service.salon_id,
owner_id: service.owner_id,

user_name,
user_phone,
user_id: user.id,   // ✅ IMPORTANT (needed for socket)

date,
time_slot,

service_charge: service.price || 0,
platform_fee: 0,
gst: 0,
total: service.price || 0
});

console.log("Booking created with owner_id:", service.owner_id);

// 🔥 SOCKET EMIT → OWNER
const io = req.app.get("io");

io.to(`owner_${service.owner_id}`).emit("new-booking", {
message: "New booking received",
booking
});

res.status(201).json({
message:"Booking created",
booking
});

}catch(error){
res.status(500).json({ message:error.message })
}
};


// ✅ OWNER ACCEPT / REJECT
const updateBookingStatus = async (req,res)=>{
try{

const {bookingId} = req.params;
const {status} = req.body;

const booking = await Booking.findOne({
where:{ id: bookingId }
});

if(!booking){
return res.status(404).json({ message:"Booking not found" });
}

if(booking.owner_id !== req.user.id){
return res.status(403).json({ message:"Unauthorized" });
}

// update status
booking.status = status;
await booking.save();

// 🔥 SOCKET EMIT → USER
const io = req.app.get("io");

io.to(`user_${booking.user_id}`).emit("booking-updated", {
message: "Booking status updated",
booking
});

res.json({
message:"Booking updated",
booking
});

}catch(error){
res.status(500).json({ message:error.message })
}
};


// ✅ OWNER BOOKINGS
const getOwnerBookings = async (req,res)=>{
try{

const bookings = await Booking.findAll({
where:{ owner_id: req.user.id }
});

res.json({ bookings });

}catch(error){
res.status(500).json({ message:error.message })
}
};


// ✅ ACCEPTED BOOKINGS
const getAcceptedBookings = async (req,res)=>{
try{

const bookings = await Booking.findAll({
where:{ 
owner_id: req.user.id,
status: "accepted"
},
order: [["createdAt", "DESC"]]
});

res.json({ bookings });

}catch(error){
res.status(500).json({ message:error.message })
}
};


// ✅ USER BOOKINGS
const getUserBookings = async (req,res)=>{
try{

const user = await User.findOne({
where:{ id: req.user.id }
});

if(!user){
return res.status(404).json({ message:"User not found" });
}

const bookings = await Booking.findAll({
where:{ user_phone: user.phone_number }
});

res.json({ bookings });

}catch(error){
res.status(500).json({ message:error.message })
}
};


// DEBUG
const getAllBookingsDebug = async (req,res)=>{
try{

const bookings = await Booking.findAll();

res.json({ 
bookings,
currentUserId: req.user.id
});

}catch(error){
res.status(500).json({ message:error.message })
}
};

export {
createBooking,
updateBookingStatus,
getOwnerBookings,
getAcceptedBookings,
getUserBookings,
getAllBookingsDebug
};