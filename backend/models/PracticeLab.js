import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({ path: String, content: { type: String, default: "" }, language: String }, { timestamps: true });
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, workspace: { type: String, enum: ["web", "react", "node", "python", "sql", "analytics", "mongodb", "api", "git", "etl"], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, template: String, description: String,
  files: [fileSchema], bookmarked: { type: Boolean, default: false }, submittedAt: Date, version: { type: Number, default: 1 },
}, { timestamps: true });

const codingSessionSchema = new mongoose.Schema({ project: { type: mongoose.Schema.Types.ObjectId, ref: "PracticeProject" }, user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, workspace: String, startedAt: { type: Date, default: Date.now }, endedAt: Date, durationSeconds: { type: Number, default: 0 }, events: [{ type: String, at: Date }] }, { timestamps: true });
const challengeSchema = new mongoose.Schema({ title: { type: String, required: true }, description: String, difficulty: { type: String, default: "Medium" }, starterCode: String, sampleInput: String, sampleOutput: String, hiddenTests: [{ input: String, output: String }], maximumScore: { type: Number, default: 100 }, expectedMinutes: Number, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }, { timestamps: true });
const statisticsSchema = new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true }, practiceSeconds: { type: Number, default: 0 }, codingStreak: { type: Number, default: 0 }, problemsSolved: { type: Number, default: 0 }, projectsBuilt: { type: Number, default: 0 }, sqlQueriesExecuted: { type: Number, default: 0 }, datasetsProcessed: { type: Number, default: 0 }, averageScore: { type: Number, default: 0 }, lastPracticeAt: Date }, { timestamps: true });

export const PracticeProject = mongoose.model("PracticeProject", projectSchema);
export const PracticeFile = mongoose.model("PracticeFile", fileSchema);
export const CodingSession = mongoose.model("CodingSession", codingSessionSchema);
export const CodingChallenge = mongoose.model("CodingChallenge", challengeSchema);
export const SqlQuery = mongoose.model("SqlQuery", new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, project: { type: mongoose.Schema.Types.ObjectId, ref: "PracticeProject" }, name: String, query: String, database: String, executionMs: Number }, { timestamps: true }));
export const Dataset = mongoose.model("Dataset", new mongoose.Schema({ owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, name: String, type: String, url: String, columns: [String], rowCount: Number }, { timestamps: true }));
export const ApiCollection = mongoose.model("ApiCollection", new mongoose.Schema({ owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, name: String, variables: mongoose.Schema.Types.Mixed, requests: [mongoose.Schema.Types.Mixed] }, { timestamps: true }));
export const GitSession = mongoose.model("GitSession", new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, project: { type: mongoose.Schema.Types.ObjectId, ref: "PracticeProject" }, commits: [mongoose.Schema.Types.Mixed], currentBranch: { type: String, default: "main" } }, { timestamps: true }));
export const PracticeStatistic = mongoose.model("PracticeStatistic", statisticsSchema);
