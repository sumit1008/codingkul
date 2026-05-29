import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  platform:   {
    type: String,
    enum: ["LeetCode", "Codeforces", "GeeksforGeeks", "CodingNinjas", "AtCoder", "Other"],
    default: "LeetCode",
  },
  link:       { type: String, default: "" },
  tags:       [{ type: String }],
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
});

const homeworkSchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, default: "" },
    batchId:     { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    lectureId:   { type: mongoose.Schema.Types.ObjectId, ref: "Lecture" },
    dueDate:     { type: Date, required: [true, "Due date is required"] },
    problems:    [problemSchema],
    difficulty:  { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    xpReward:    { type: Number, default: 100, min: 0 },
    isMandatory: { type: Boolean, default: false },
  },
  { timestamps: true }
);

homeworkSchema.index({ batchId: 1, dueDate: 1 });
homeworkSchema.index({ lectureId: 1 });

const Homework = mongoose.model("Homework", homeworkSchema);
export default Homework;
