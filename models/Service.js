import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Owner from "./ownerModel.js";

const Service = sequelize.define("Service",{

id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},

owner_id:{
type:DataTypes.UUID,
allowNull:false
    },

salon_id:{
type:DataTypes.UUID,
allowNull:false
},

name:{
type:DataTypes.STRING,
allowNull:false
},

price:{
type:DataTypes.FLOAT,
allowNull:false
},

serviceImg:{
type:DataTypes.ARRAY(DataTypes.STRING),
defaultValue:[]
},

category:{
type:DataTypes.STRING,
defaultValue:"Haircut"
}

},{
timestamps:true,
tableName:"services"
})

Service.belongsTo(Owner, { foreignKey: 'owner_id', as: 'owner', constraints: false });

export default Service;