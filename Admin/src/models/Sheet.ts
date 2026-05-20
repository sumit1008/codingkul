import mongoose, { Document, Schema } from "mongoose";

export interface ISheet extends Document {
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  isPublished: boolean;
  isPremium: boolean;
  order: number;
  totalProblems: number;
  accentColor: string;
  accentFrom: string;
  accentTo: string;
  createdAt: Date;
  updatedAt: Date;
}

const SheetSchema = new Schema<ISheet>(
  {
    title:        { type: String, required: true, trim: true },
    slug:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:  { type: String, default: "" },
    thumbnail:    { type: String, default: "" },
    isPublished:  { type: Boolean, default: false },
    isPremium:    { type: Boolean, default: false },
    order:        { type: Number, default: 0 },
    totalProblems:{ type: Number, default: 0 },
    accentColor:  { type: String, default: "#6366f1" },
    accentFrom:   { type: String, default: "#6366f1" },
    accentTo:     { type: String, default: "#a855f7" },
  },
  { timestamps: true }
);

SheetSchema.index({ slug: 1 });
SheetSchema.index({ order: 1 });

export const Sheet =
  mongoose.models.Sheet ?? mongoose.model<ISheet>("Sheet", SheetSchema);
