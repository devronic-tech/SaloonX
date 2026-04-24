import "dotenv/config";
import bcrypt from "bcrypt";
import sequelize from "../config/database.js";
import Owner from "../models/ownerModel.js";
import Service from "../models/Service.js";

async function seedData() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("Connected to database.");

    // Sync models (ensure tables exist)
    await sequelize.sync({ force: false });

    const passwordHash = await bcrypt.hash("password123", 10);

    for (let i = 1; i <= 10; i++) {
      const salonEmail = `saloon_test_${i}@test.com`;
      const salonName = `Saloon Test ${i}`;
      
      console.log(`Creating ${salonName}...`);

      // Create Salon Owner
      const owner = await Owner.create({
        name: `Owner Test ${i}`,
        email: salonEmail,
        phone_number: `123456789${i % 10}`,
        dob: "1990-01-01",
        address: `${i}23 Test Street, City ${i}`,
        salonName: salonName,
        profile_image: "/images/img.png",
        background_image: "/images/img.png",
        is_verified: true,
        password: passwordHash,
        barber_names: [
          `Barber ${i}_1`,
          `Barber ${i}_2`,
          `Barber ${i}_3`,
          `Barber ${i}_4`,
          `Barber ${i}_5`
        ],
        aboutSalon: `This is a test description for ${salonName}.`,
        salonStatus: 'open'
      });

      // Create 5 Services for this salon
      const serviceCategories = ['Haircut', 'Beard', 'Hair Spa', 'Straightening Or Curls', 'Other'];
      
      for (let j = 1; j <= 5; j++) {
        await Service.create({
          saloon_id: owner.id,
          name: `Service ${i}_${j}`,
          price: 100 * j,
          serviceImg: `/images/services/s${(j % 10) + 1}.jpg`,
          category: serviceCategories[j-1] || 'Haircut'
        });
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedData();
