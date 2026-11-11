export const amcHeaders = [
  "Basic Software AMC Charges", "Application Maintenance AMC", "Website Maintenance AMC", "Web Application Maintenance AMC", "Mobile Application Maintenance AMC", "Bug Fixing & Error Resolution AMC", "Technical Support AMC", "Software Updates & Upgrades AMC", "Backend & API Maintenance AMC", "Database Maintenance AMC", "Server & Hosting Maintenance AMC", "Cloud Infrastructure Maintenance AMC", "AWS Infrastructure AMC", "DevOps & Deployment AMC", "Backup & Disaster Recovery AMC", "Application Security & Monitoring AMC", "AI Calling System AMC", "AI Voice Bot Maintenance AMC", "AI Chatbot Maintenance AMC", "AI Agent Maintenance AMC", "AI & LLM Integration AMC", "Machine Learning Model Maintenance AMC", "AI & ML Development Support AMC", "RAG & Vector Database Maintenance AMC", "WhatsApp Business API Maintenance AMC", "SMS Gateway Maintenance AMC", "Email & SMTP Maintenance AMC", "Third-Party API Integration AMC", "Payment Gateway Integration AMC", "Performance Optimization AMC", "Monthly System Health Check AMC", "Quarterly Technical Audit AMC", "PLC Integration Maintenance AMC", "IoT & Industrial Automation AMC", "Biometric Integration Maintenance AMC", "Custom Software Development Support AMC", "UI/UX Enhancement Support AMC", "System Monitoring & Reporting AMC", "Software Consultation & Technical Assistance AMC", "Annual Software Maintenance & Support AMC",
];
export const amcTotals = cost => {
  const subtotal = Math.round(Number(cost || 0) * 100) / 100;
  const gst = Math.round(subtotal * 18) / 100;
  return { subtotal, gst, total: Math.round((subtotal + gst) * 100) / 100 };
};
export const amcMoney = value => `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const amcColumns = ["AMC Header / Coverage", "Billing Frequency", "AMC Cost (excl. GST)", "GST (18%)", "Total Payable"];
export function amcCells(item) {
  const totals = amcTotals(item.cost);
  return [`${item.service}${item.description ? `\n${item.description}` : ""}`, item.billingFrequency || "—", item.cost == null ? item.charges || "—" : amcMoney(totals.subtotal), item.cost == null ? "—" : amcMoney(totals.gst), item.cost == null ? "—" : amcMoney(totals.total)];
}
