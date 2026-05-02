import Owner from "../models/ownerModel.js";
import Service from "../models/Service.js";
import { Op } from "sequelize";

export const searchEverything = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Search Salons (Owners)
    const salons = await Owner.findAll({
      where: {
        is_verified: true,
        [Op.or]: [
          { salonName: { [Op.iLike]: `%${query}%` } },
          { name: { [Op.iLike]: `%${query}%` } },
          { address: { [Op.iLike]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'name', 'salonName', 'address', 'profile_image', 'saloonImg', 'salonStatus', 'aboutSalon', 'total_rating', 'rating_count']
    });

    // Search Services
    const services = await Service.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: Owner,
          as: 'owner', // Make sure this association exists
          attributes: ['id', 'salonName', 'profile_image', 'address', 'total_rating', 'rating_count']
        }
      ]
    });

    res.status(200).json({
      salons,
      services
    });

  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: error.message });
  }
};
