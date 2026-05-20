/**
 * Seed script — creates the admin user in MongoDB.
 * Usage: npm run seed
 * Reads MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD from .env.local
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const MONGODB_URI  = process.env.MONGODB_URI!;
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌  Missing MONGODB_URI, ADMIN_EMAIL, or ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, default: "superadmin" },
  name:     { type: String, default: "Super Admin" },
}, { timestamps: true });

async function main() {
  console.log("🔗  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);

  const Admin = mongoose.models.Admin ?? mongoose.model("Admin", AdminSchema);

  const existing = await Admin.findOne({ email: ADMIN_EMAIL.toLowerCase() });

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);

  if (existing) {
    await Admin.updateOne({ _id: existing._id }, { $set: { password: hashed } });
    console.log(`✅  Admin password updated for: ${ADMIN_EMAIL}`);
  } else {
    await Admin.create({ email: ADMIN_EMAIL.toLowerCase(), password: hashed, role: "superadmin", name: "Super Admin" });
    console.log(`✅  Admin created: ${ADMIN_EMAIL}`);
  }

  await mongoose.disconnect();
  console.log("👋  Done");
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
