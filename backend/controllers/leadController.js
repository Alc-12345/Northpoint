import ActivityLog from "../models/ActivityLog.js";
import Lead from "../models/Lead.js";
import Project from "../models/Project.js";

const projectNeedLabels = {
  website: "Website Development",
  "web-app": "Web Application",
  "mobile-app": "Mobile App",
  saas: "SaaS Product",
  ai: "AI Integration / AI Solution",
  game: "Game Development",
  uiux: "UI/UX Design",
  ecommerce: "E-commerce Solution",
  "erp-crm": "ERP / CRM System",
  automation: "Business Automation",
  custom: "Custom Software",
  other: "Other",
};

const budgetToNumber = {
  "under-1000": 1000,
  "1000-5000": 5000,
  "5000-10000": 10000,
  "10000-25000": 25000,
  "25000-plus": 25000,
};

const nextCode = async (Model, prefix) =>
  `${prefix}-${new Date().getFullYear()}-${String((await Model.countDocuments()) + 1).padStart(3, "0")}`;

const logActivity = async ({ req, action, entityType, entityId, metadata = {} }) => {
  await ActivityLog.create({
    user: req.user?._id || null,
    action,
    entityType,
    entityId,
    metadata,
    ipAddress: req.ip,
  });
};

export const createLead = async (req, res) => {
  const name = req.body.name || req.body.from_name;
  const email = req.body.email || req.body.from_email;
  const projectNeed = req.body.projectNeed || req.body.project_need;
  const projectStage = req.body.projectStage || req.body.project_stage;
  const projectBudget = req.body.projectBudget || req.body.project_budget;
  const projectTimeline = req.body.projectTimeline || req.body.project_timeline;
  const businessDetails = req.body.businessDetails || req.body.business_details;

  const lead = await Lead.create({
    leadId: await nextCode(Lead, "LEAD"),
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
    source: req.body.source || "Website",
    status: req.body.status || "New Lead",
  });

  await logActivity({
    req,
    action: "Lead Created",
    entityType: "Lead",
    entityId: lead._id,
    metadata: { source: lead.source },
  });

  res.status(201).json({
    message: "Lead submitted successfully",
    lead,
  });
};

export const getLeads = async (req, res) => {
  const leads = await Lead.find()
    .populate("assignedTo", "name email role")
    .populate("convertedProject", "name projectCode status")
    .sort({ createdAt: -1 });

  res.json(leads);
};

export const getLeadById = async (req, res) => {
  const lead = await Lead.findById(req.params.id)
    .populate("assignedTo", "name email role")
    .populate("convertedProject", "name projectCode status");

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

export const convertLeadToProject = async (req, res) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  if (lead.convertedProject) {
    const existingProject = await Project.findById(lead.convertedProject);

    if (existingProject) {
      return res.json({
        message: "Lead already converted",
        lead,
        project: existingProject,
        clientPrefill: buildClientPrefill(lead, existingProject),
      });
    }
  }

  const service = lead.service || lead.projectNeed;
  const serviceLabel = projectNeedLabels[service] || service || "Project";
  const project = await Project.create({
    projectCode: await nextCode(Project, "PRJ"),
    lead: lead._id,
    name: `${serviceLabel} - ${lead.name}`,
    clientName: lead.name,
    company: lead.company,
    email: lead.email,
    phone: lead.phone,
    service: serviceLabel,
    budget: budgetToNumber[lead.projectBudget || lead.budget],
    milestone: lead.projectTimeline,
    status: "Pending",
    progress: 0,
    priority: "Medium",
    startDate: new Date(),
    description: [
      lead.businessDetails,
      lead.message,
      lead.industry ? `Industry: ${lead.industry}` : "",
      lead.website ? `Website: ${lead.website}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    activityLogs: [
      {
        action: "Project Created",
        details: `Created from lead ${lead.leadId || lead._id}`,
      },
    ],
  });

  lead.status = "Converted";
  lead.convertedProject = project._id;
  await lead.save();

  await logActivity({
    req,
    action: "Project Created",
    entityType: "Project",
    entityId: project._id,
    metadata: { leadId: lead._id },
  });

  res.status(201).json({
    message: "Lead converted to project successfully",
    lead,
    project,
    clientPrefill: buildClientPrefill(lead, project),
  });
};

function buildClientPrefill(lead, project) {
  return {
    projectId: project._id,
    projectName: project.name,
    company: lead.company,
    name: lead.name,
    contact: lead.name,
    email: lead.email,
    phone: lead.phone,
    industry: lead.industry || "General",
  };
}
