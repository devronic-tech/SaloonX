import "dotenv/config";
import bcrypt from "bcrypt";
import { switchToLocal, getActiveInstance } from "./config/database.js";

// Import all models
import Owner from "./models/ownerModel.js";
import Salon from "./models/salonModel.js";
import Service from "./models/Service.js";
import User from "./models/User.js";
import "./models/otpModel.js";
import "./models/ownerOtp.js";
import "./models/Booking.js";

switchToLocal();
const sequelize = getActiveInstance();

async function seedDatabase() {
  try {
    console.log("Starting Database Sync (FORCE)...");
    await sequelize.sync({ force: true });
    console.log("Database synced successfully.");

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 1. Create Test Owner
    console.log("Creating Test Owner...");
    const owner = await Owner.create({
      name: "Test Owner",
      email: "owner@test.com",
      password: hashedPassword,
      phone_number: "1234567890",
      address: "123 Owner St",
      dob: "1990-01-01",
      profile_image: "https://via.placeholder.com/150",
      background_image: "https://via.placeholder.com/600x200",
      is_verified: true,
      salonStatus: "open",
      aboutSalon: "A premium test salon for all your needs."
    });
    console.log("Owner created:", owner.email);

    // 2. Create Test Salon
    console.log("Creating Test Salon...");
    const salon = await Salon.create({
      owner_id: owner.id,
      salon_name: "Premium Salon X",
      owner_name: owner.name,
      address: owner.address,
      email: owner.email,
      phone_number: owner.phone_number,
      password: hashedPassword, // Salon model also seems to have a password field in your schema
      barbers: ["John Doe", "Jane Smith"],
      salon_image: ["https://via.placeholder.com/400x300"]
    });
    console.log("Salon created:", salon.salon_name);

    // 3. Create Test Services
    console.log("Creating Test Services...");
    const services = await Service.bulkCreate([
      {
        owner_id: owner.id,
        salon_id: salon.id,
        name: "Haircut",
        price: 25.0,
        category: "Haircut",
        serviceImg: ["https://via.placeholder.com/200"]
      },
      {
        owner_id: owner.id,
        salon_id: salon.id,
        name: "Beard Trim",
        price: 15.0,
        category: "Grooming",
        serviceImg: ["https://via.placeholder.com/200"]
      },
      {
        owner_id: owner.id,
        salon_id: salon.id,
        name: "Facial",
        price: 40.0,
        category: "Skincare",
        serviceImg: ["https://via.placeholder.com/200"]
      }
    ]);
    console.log(`${services.length} services created.`);

    // 4. Create Test User (Optional)
    console.log("Creating Test User...");
    const user = await User.create({
      name: "Test User",
      email: "user@test.com",
      password: hashedPassword,
      phone_number: "0987654321"
    });
    console.log("User created:", user.email);

    console.log("\nDatabase seeding completed successfully!");
    console.log("Login Credentials:");
    console.log("Owner Email: owner@test.com | Password: password123");
    console.log("User Email: user@test.com | Password: password123");

  } catch (error) {
    console.error("Seeding Error:", error.message);
    console.error(error.stack);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();