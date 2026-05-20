import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

import User from "../src/models/User.js";

const SEED_USERS = [
  {
    fullName: "Free Tester",
    username: "freetester",
    email: "none@test.com",
    password: "12345678",
    courseTier: "NONE",
    purchasedCourses: [],
    level: 1,
    xp: 0,
    streak: 0,
  },
  {
    fullName: "Foundation Tester",
    username: "foundationtester",
    email: "foundation@test.com",
    password: "12345678",
    courseTier: "FOUNDATION",
    purchasedCourses: ["foundation"],
    level: 3,
    xp: 1500,
    streak: 5,
  },
  {
    fullName: "Accelerator Tester",
    username: "acceleratortester",
    email: "accelerator@test.com",
    password: "12345678",
    courseTier: "ACCELERATOR",
    purchasedCourses: ["foundation", "accelerator"],
    level: 6,
    xp: 5200,
    streak: 12,
  },
  {
    fullName: "Placement Tester",
    username: "placementtester",
    email: "placement@test.com",
    password: "12345678",
    courseTier: "PLACEMENT",
    purchasedCourses: ["foundation", "accelerator", "placement"],
    level: 8,
    xp: 12450,
    streak: 23,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const userData of SEED_USERS) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        // Fix double-hash if already seeded incorrectly
        const hashed = await bcrypt.hash(userData.password, 12);
        await User.updateOne({ email: userData.email }, { $set: { password: hashed } });
        console.log(`  Fixed password for: ${userData.email}`);
        continue;
      }

      // Pass plain password — the pre-save hook hashes it
      await User.create({
        ...userData,
        authProvider: "local",
        isVerified: true,
      });
      console.log(`  Created: ${userData.email} (tier: ${userData.courseTier})`);
    }

    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
