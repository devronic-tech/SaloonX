import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import User from "../models/User.js";


// ✅ CREATE BOOKING
const createBooking = async (req,res)=>{
try{

const {date,time_slot} = req.body;
const {serviceId} = req.params;

// Get user info from authenticated user
const user = await User.findOne({
where:{ id: req.user.id }
});

if(!user){
return res.status(404).json({ message:"User not found" });
}

const user_name = user.name;
const user_phone = user.phone_number;

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
})
}

const booking = await Booking.create({

service_id: service.id,
service_name: service.name,
salon_id: service.salon_id,
owner_id: service.owner_id,

user_name,
user_phone,
date,
time_slot,

// Add pricing details from service
service_charge: service.price || 0,
platform_fee: 0,
gst: 0,
total: service.price || 0

});

console.log("Booking created with owner_id:", service.owner_id);

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

booking.status = status;
await booking.save();

res.json({
message:"Booking updated",
booking
});

}catch(error){
res.status(500).json({ message:error.message })
}
};


// Owner Bookings
const getOwnerBookings = async (req,res)=>{
try{
console.log("getOwnerBookings - req.user:", req.user);

const bookings = await Booking.findAll({
where:{ owner_id: req.user.id }
});

console.log("getOwnerBookings - Found bookings:", bookings.length);
console.log("getOwnerBookings - owner_id used:", req.user.id);

res.json({ bookings });

}catch(error){
res.status(500).json({ message:error.message })
}
};

// ✅ Get Accepted Bookings for Owner (for Today's Appointments)
const getAcceptedBookings = async (req,res)=>{
try{
console.log("getAcceptedBookings - req.user:", req.user);

const bookings = await Booking.findAll({
where:{ 
owner_id: req.user.id,
status: "accepted"
},
order: [["createdAt", "DESC"]] // Latest first
});

console.log("getAcceptedBookings - Found accepted bookings:", bookings.length);

res.json({ bookings });

}catch(error){
res.status(500).json({ message:error.message })
}
};


//User Bookings
const getUserBookings = async (req,res)=>{
try{

// Get user info from authenticated user
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

// Debug - Get all bookings
const getAllBookingsDebug = async (req,res)=>{
try{
console.log("getAllBookingsDebug - req.user:", req.user);

const bookings = await Booking.findAll();

console.log("getAllBookingsDebug - Total bookings:", bookings.length);

// Get unique owner_ids
const ownerIds = [...new Set(bookings.map(b => b.owner_id))];
console.log("getAllBookingsDebug - Unique owner_ids:", ownerIds);

res.json({ 
bookings,
ownerIds,
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