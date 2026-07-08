import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { leadApi } from "../services/api";

const projectNeeds = [
  ["website", "Website Development"],
  ["web-app", "Web Application"],
  ["mobile-app", "Mobile App"],
  ["saas", "SaaS Product"],
  ["ai", "AI Integration / AI Solution"],
  ["game", "Game Development"],
  ["uiux", "UI/UX Design"],
  ["ecommerce", "E-commerce Solution"],
  ["erp-crm", "ERP / CRM System"],
  ["automation", "Business Automation"],
  ["custom", "Custom Software"],
  ["other", "Other"],
];

export default function AddClient() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectNeed: "",
    projectStage: "",
    projectBudget: "",
    projectTimeline: "",
    industry: "",
    website: "",
    businessDetails: "",
    name: "",
    email: "",
    message: "",
    status: "New",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-white";

  const labelClass = "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await leadApi.create(formData);
      navigate("/clients");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800 dark:bg-[#0b1220] dark:text-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Lead</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fields match the website project request form.</p>
        </div>
        <button onClick={() => navigate("/clients")} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-[#243244] dark:bg-[#0b1220]">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <section>
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold dark:border-[#243244]">
            01 | Tell Us About Your Project
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="What do you need? *">
              <select name="projectNeed" value={formData.projectNeed} onChange={handleChange} required className={inputClass}>
                <option value="" disabled>Select need</option>
                {projectNeeds.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>

            <Field label="Project Stage *">
              <select name="projectStage" value={formData.projectStage} onChange={handleChange} required className={inputClass}>
                <option value="" disabled>Select stage</option>
                <option value="idea">Just an Idea</option>
                <option value="planning">Planning</option>
                <option value="design">Design Ready</option>
                <option value="development">Already in Development</option>
                <option value="redesign">Need Improvement / Redesign</option>
              </select>
            </Field>

            <Field label="Estimated Budget *">
              <select name="projectBudget" value={formData.projectBudget} onChange={handleChange} required className={inputClass}>
                <option value="" disabled>Select budget</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-plus">$25,000+</option>
                <option value="discuss">Let's Discuss</option>
              </select>
            </Field>

            <Field label="Preferred Timeline *">
              <select name="projectTimeline" value={formData.projectTimeline} onChange={handleChange} required className={inputClass}>
                <option value="" disabled>Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="2-weeks">Within 2 Weeks</option>
                <option value="1-month">Within 1 Month</option>
                <option value="2-3-months">2-3 Months</option>
                <option value="flexible">Flexible</option>
              </select>
            </Field>
          </div>
        </section>

        <section>
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold dark:border-[#243244]">
            02 | About Your Business
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Your Industry *">
              <input name="industry" value={formData.industry} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Website / Social">
              <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} />
            </Field>
          </div>
          <div className="mt-5">
            <label className={labelClass}>Business Details *</label>
            <textarea name="businessDetails" value={formData.businessDetails} onChange={handleChange} required rows={4} className={inputClass} />
          </div>
        </section>

        <section>
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-lg font-semibold dark:border-[#243244]">
            03 | About Yourself
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full Name *">
              <input name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Email *">
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} />
            </Field>
          </div>
          <div className="mt-5">
            <label className={labelClass}>Anything else?</label>
            <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className={inputClass} />
          </div>
        </section>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-4 dark:border-[#243244]">
          <button type="button" onClick={() => navigate("/clients")} className="rounded-lg border border-gray-300 px-5 py-2 dark:border-gray-600">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}
