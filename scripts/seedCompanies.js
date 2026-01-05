import mongoose from "mongoose";
import Company from "../models/companyModel.js";
import "dotenv/config";

const STATUSES = ["active", "inactive"];
const PRICES = [499, 999, 1999];

const seedCompanies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    const companies = [];

    for (let i = 1; i <= 50; i++) {
      const isTrial = i % 3 === 0;       
      const isActive = i % 4 !== 0;       
      const status = isActive ? "active" : "inactive";

      companies.push({
        name: `Company ${i}`,
        admin: `admin${i}@mail.com`,
        status,
        employeesCount: Math.floor(Math.random() * 200) + 5,
        createdAt: new Date(Date.now() - i * 86400000),
        subscription: {
          isTrial,
          trialEndsAt: isTrial
            ? new Date(Date.now() + 7 * 86400000)
            : null,
          isActive: !isTrial && isActive,
          price: !isTrial && isActive
            ? PRICES[Math.floor(Math.random() * PRICES.length)]
            : 0
        }
      });
    }

    await Company.insertMany(companies);
    console.log("Companies seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedCompanies();
