import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Salon = sequelize.define("Salon",{

id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},

owner_id:{
type:DataTypes.UUID,
allowNull:false
},

salon_name:{
type:DataTypes.STRING,
allowNull:false
},

owner_name:{
type:DataTypes.STRING,
allowNull:false
},

address:{
type:DataTypes.STRING,
allowNull:false
},

email:{
type:DataTypes.STRING,
allowNull:false
},

phone_number:{
type:DataTypes.STRING,
allowNull:false
},

password:{
type:DataTypes.STRING,
allowNull:false
},

barbers:{
type:DataTypes.ARRAY(DataTypes.STRING),
defaultValue:[]
},

salon_image:{
type:DataTypes.ARRAY(DataTypes.STRING),
defaultValue:[]
}

},{
timestamps:true,
tableName:"salons"
})

export default Salon