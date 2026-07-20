import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({ name: String, url: String, type: String }, { _id: false });
const common = { timestamps: true };

export const Course = mongoose.model("Course", new mongoose.Schema({
  name: { type: String, required: true, trim: true }, description: String, category: String,
  thumbnail: String, trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, duration: String,
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  status: { type: String, enum: ["Draft", "Published", "Archived"], default: "Draft" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, common));

export const Batch = mongoose.model("Batch", new mongoose.Schema({
  name: { type: String, required: true }, course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, startDate: Date, endDate: Date,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], schedule: String,
  status: { type: String, enum: ["Upcoming", "Active", "Completed"], default: "Upcoming" },
}, common));

export const LiveClass = mongoose.model("LiveClass", new mongoose.Schema({
  title: { type: String, required: true }, course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" }, trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startsAt: Date, endsAt: Date, meetingLink: String, recordingLink: String, notes: String,
}, common));

export const Assignment = mongoose.model("Assignment", new mongoose.Schema({
  title: { type: String, required: true }, description: String, instructions: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  difficulty: { type: String, default: "Medium" }, maximumMarks: { type: Number, default: 100 }, dueDate: Date,
  attachments: [attachmentSchema], starterCode: String, referenceLinks: [String], published: { type: Boolean, default: false },
}, common));

export const CodingProblem = mongoose.model("CodingProblem", new mongoose.Schema({
  title: { type: String, required: true }, statement: String, inputFormat: String, outputFormat: String,
  constraints: String, sampleInput: String, sampleOutput: String, hiddenTestCases: [{ input: String, output: String }],
  marks: { type: Number, default: 100 }, difficulty: { type: String, default: "Medium" }, languages: [String],
}, common));

export const Resource = mongoose.model("Resource", new mongoose.Schema({
  title: { type: String, required: true }, course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  type: { type: String, enum: ["PDF", "PPT", "Video", "ZIP", "Code", "Link"], default: "Link" }, url: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, common));

export const Quiz = mongoose.model("Quiz", new mongoose.Schema({
  title: { type: String, required: true }, course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  timeLimit: Number, negativeMarking: { type: Boolean, default: false }, published: { type: Boolean, default: false },
  questions: [{ question: String, type: { type: String, enum: ["MCQ", "TrueFalse", "MultipleSelect", "Programming"] }, options: [String], answer: mongoose.Schema.Types.Mixed, marks: Number }],
}, common));

export const Certificate = mongoose.model("Certificate", new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, certificateId: { type: String, required: true, unique: true }, qrToken: String, issueDate: { type: Date, default: Date.now },
}, common));
