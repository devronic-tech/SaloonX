import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Otp = sequelize.define("Otp",{

 name:{
  type:DataTypes.STRING
 },

 email:{
  type:DataTypes.STRING
 },

 password:{
  type:DataTypes.STRING
 },

 phone_number:{
  type:DataTypes.STRING
 },

 otp:{
  type:DataTypes.STRING
 },

 expires_at:{
  type:DataTypes.DATE
 }

},{
 timestamps:true,
 tableName:"otp"
})

export default Otp