import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Owner = sequelize.define("Owner",{

id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
name:{
type:DataTypes.STRING,
allowNull:false
},

email:{
type:DataTypes.STRING,
unique:true,
allowNull:false
},

phone_number:{
type:DataTypes.STRING,
allowNull:false
},

dob:{
type:DataTypes.DATEONLY,
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

is_verified:{
  type:DataTypes.BOOLEAN,
  defaultValue:false
},

password:{
  type:DataTypes.STRING,
  allowNull:false
},
saloonImg:{
  type:DataTypes.ARRAY(DataTypes.STRING),
  allowNull:true
}
},{
timestamps:true,
tableName:"owners"
})

export default Owner
