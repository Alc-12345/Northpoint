import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  const name = req.body.name || req.body.from_name;
  const email = req.body.email || req.body.from_email;
  const projectNeed = req.body.projectNeed || req.body.project_need;
  const projectStage = req.body.projectStage || req.body.project_stage;
  const projectBudget = req.body.projectBudget || req.body.project_budget;
  const projectTimeline = req.body.projectTimeline || req.body.project_timeline;
  const businessDetails = req.body.businessDetails || req.body.business_details;

  const lead = await Lead.create({
    name,
    email,
    phone: req.body.phone,
    company: req.body.company,
    service: req.body.service || projectNeed,
    budget: req.body.budget || projectBudget,
    projectNeed,
    projectStage,
    projectBudget,
    projectTimeline,
    industry: req.body.industry,
    website: req.body.website,
    businessDetails,
    message: req.body.message,
    source: req.body.source || "company-website",
  });

  res.status(201).json({
    message: "Lead submitted successfully",
    lead,
  });
};

export const getLeads = async (req, res) => {
  const leads = await Lead.find()
    .populate("assignedTo", "name email role")
    .sort({ createdAt: -1 });

  res.json(leads);
};

export const getLeadById = async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate(
    "assignedTo",
    "name email role"
  );

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  res.json(lead);
};

export const updateLead = async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("assignedTo", "name email role");

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  res.json(lead);
};

export const deleteLead = async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  res.json({ message: "Lead deleted successfully" });
};
