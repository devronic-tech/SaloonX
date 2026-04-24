import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OwnerOtp = sequelize.define("OwnerOtp",{

name:{
type:DataTypes.STRING
},

email:{
type:DataTypes.STRING
},

phone_number:{
type:DataTypes.STRING
},

dob:{
type:DataTypes.DATEONLY
},

address:{
  type:DataTypes.STRING,
  allowNull:false
},

profile_image:{
  type:DataTypes.STRING,
  allowNull:false
},

background_image:{
  type:DataTypes.STRING,
  allowNull:false
},

otp:{
type:DataTypes.STRING
},

expires_at:{
type:DataTypes.DATE
},

password:{
type:DataTypes.STRING
}

},{
timestamps:true,
tableName:"owner_otp"
})

export default OwnerOtp
