import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Owner from "./ownerModel.js";

const Booking = sequelize.define("Booking",{

id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},

user_id:{
type:DataTypes.UUID,
allowNull:true
},

service_id:{
type:DataTypes.UUID,
allowNull:false
},

salon_id:{
type:DataTypes.UUID,
allowNull:false
},

owner_id:{
type:DataTypes.UUID,
allowNull:false
},

service_name:{
type:DataTypes.STRING
},

user_name:{
type:DataTypes.STRING,
allowNull:false
},

user_phone:{
type:DataTypes.STRING,
allowNull:false
},

date:{
type:DataTypes.DATEONLY,
allowNull:false
},

time_slot:{
type:DataTypes.STRING,
allowNull:false
},

barber:{
type:DataTypes.STRING,
allowNull:true
},

service_charge:{
type:DataTypes.INTEGER,
defaultValue:0
},

platform_fee:{
type:DataTypes.INTEGER,
defaultValue:0
},

gst:{
type:DataTypes.INTEGER,
defaultValue:0
},

total:{
type:DataTypes.INTEGER,
defaultValue:0
},

  status:{
    type:DataTypes.ENUM("pending","accepted","rejected","cancelled","completed"),
    defaultValue:"pending"
  },
  
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }

},{
timestamps:true,
tableName:"bookings"
})

Booking.belongsTo(Owner, { foreignKey: 'owner_id', as: 'salon', constraints: false });

export default Booking;