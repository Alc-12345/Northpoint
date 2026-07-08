import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clientApi, leadApi } from "../services/api";

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

const createUsername = (value) =>
  `${String(value || "client")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()
    .slice(0, 12) || "client"}01`;

const createPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789#$@!";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export default function AddClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const clientPrefill = location.state?.clientPrefill;
  const isClientAccountMode = Boolean(clientPrefill);

  const [formData, setFormData] = useState({
    project_need: "",
    project_stage: "",
    project_budget: "",
    project_timeline: "",
    industry: "",
    website: "",
    business_details: "",
    from_name: "",
    from_email: "",
    message: "",
    source: "Manual",
    status: "New Lead",
  });
  const [clientData, setClientData] = useState({
    projectId: clientPrefill?.projectId || "",
    name: clientPrefill?.company || clientPrefill?.name || "",
    contact: clientPrefill?.contact || clientPrefill?.name || "",
    email: clientPrefill?.email || "",
    phone: clientPrefill?.phone || "",
    industry: clientPrefill?.industry || "General",
    username: createUsername(clientPrefill?.company || clientPrefill?.name),
    password: createPassword(),
  });
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full rounded-md border-2 border-gray-300 bg-gray-50 p-3 font-semibold text-gray-900 outline-none placeholder:text-gray-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-[#2a2a2a] dark:text-white dark:placeholder:text-gray-400";

  const pageTitle = useMemo(
    () => (isClientAccountMode ? "Create Client Account" : "Add Lead"),
    [isClientAccountMode]
  );

  const handleLeadChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleClientChange = (event) => {
    setClientData({
      ...clientData,
      [event.target.name]: event.target.value,
    });
  };

  const regenerateCredentials = () => {
    setClientData({
      ...clientData,
      username: createUsername(clientData.name || clientData.contact),
      password: createPassword(),
    });
  };

  const handleLeadSubmit = async (event) => {
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

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setCreatedCredentials(null);
    setIsSubmitting(true);

    try {
      const result = await clientApi.create(clientData);
      setCreatedCredentials(result.credentials);
      setTimeout(() => navigate("/projects"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isClientAccountMode) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 text-gray-800 dark:bg-[#0b1220] dark:text-gray-200">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{pageTitle}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Project created. Create the linked client login credentials.
            </p>
          </div>
          <button onClick={() => navigate("/clients")} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
            Back to Leads
          </button>
        </div>

        <form onSubmit={handleClientSubmit} className="max-w-4xl space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-[#243244] dark:bg-[#0b1220]">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          {createdCredentials && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Client created. Login: {createdCredentials.username || createdCredentials.email} / {createdCredentials.password}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company Name *">
              <input name="name" value={clientData.name} onChange={handleClientChange} required className={inputClass} />
            </Field>
            <Field label="Client Name *">
              <input name="contact" value={clientData.contact} onChange={handleClientChange} required className={inputClass} />
            </Field>
            <Field label="Email *">
              <input type="email" name="email" value={clientData.email} onChange={handleClientChange} required className={inputClass} />
            </Field>
            <Field label="Phone *">
              <input name="phone" value={clientData.phone} onChange={handleClientChange} required className={inputClass} />
            </Field>
            <Field label="Industry *">
              <input name="industry" value={clientData.industry} onChange={handleClientChange} required className={inputClass} />
            </Field>
            <Field label="Username *">
              <input name="username" value={clientData.username} onChange={handleClientChange} required className={inputClass} />
            </Field>
            <Field label="Secure Password *">
              <input name="password" value={clientData.password} onChange={handleClientChange} required minLength={6} className={inputClass} />
            </Field>
          </div>

          <div className="flex justify-end gap-4 border-t border-gray-200 pt-4 dark:border-[#243244]">
            <button type="button" onClick={regenerateCredentials} className="rounded-lg border border-gray-300 px-5 py-2 dark:border-gray-600">
              Generate Username & Password
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
              {isSubmitting ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800 dark:bg-[#0b1220] dark:text-gray-200">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{pageTitle}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create leads with the same fields as the website project request form.</p>
        </div>
        <button onClick={() => navigate("/clients")} className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
          Cancel
        </button>
      </div>

      <form onSubmit={handleLeadSubmit} className="max-w-5xl space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow dark:border-[#243244] dark:bg-[#0b1220]">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="text-2xl font-black tracking-tight text-gray-900 dark:text-white md:text-3xl">
          Welcome,<br />
          <span className="text-base font-bold tracking-normal text-gray-600 dark:text-gray-400 md:text-lg">
            fill this up to continue
          </span>
        </div>

        <section>
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xl font-black dark:border-[#243244]">
            01 | Tell Us About Your Project
          </h3>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <Field>
              <select name="project_need" value={formData.project_need} onChange={handleLeadChange} required className={inputClass}>
                <option value="" disabled>What do you need?*</option>
                {projectNeeds.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>
            <Field>
              <select name="project_stage" value={formData.project_stage} onChange={handleLeadChange} required className={inputClass}>
                <option value="" disabled>Project Stage*</option>
                <option value="idea">Just an Idea</option>
                <option value="planning">Planning</option>
                <option value="design">Design Ready</option>
                <option value="development">Already in Development</option>
                <option value="redesign">Need Improvement / Redesign</option>
              </select>
            </Field>
            <Field>
              <select name="project_budget" value={formData.project_budget} onChange={handleLeadChange} required className={inputClass}>
                <option value="" disabled>Estimated Budget*</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-plus">$25,000+</option>
                <option value="discuss">Let's Discuss</option>
              </select>
            </Field>
            <Field>
              <select name="project_timeline" value={formData.project_timeline} onChange={handleLeadChange} required className={inputClass}>
                <option value="" disabled>Preferred Timeline*</option>
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
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xl font-black dark:border-[#243244]">
            02 | About Your Business
          </h3>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <Field>
              <input name="industry" value={formData.industry} onChange={handleLeadChange} required placeholder="Your Industry*" className={inputClass} />
            </Field>
            <Field>
              <input type="url" name="website" value={formData.website} onChange={handleLeadChange} placeholder="Link to website/social (optional)" className={inputClass} />
            </Field>
          </div>
          <div className="mt-5">
            <textarea
              name="business_details"
              value={formData.business_details}
              onChange={handleLeadChange}
              required
              rows={3}
              placeholder="Briefly explain your business* (Like you're explaining it to a 5-year-old)"
              className={`${inputClass} h-auto resize-none`}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-4 border-b border-gray-200 pb-2 text-xl font-black dark:border-[#243244]">
            03 | About Yourself
          </h3>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <Field>
              <input name="from_name" value={formData.from_name} onChange={handleLeadChange} required placeholder="What's your name?* (Full name)" className={inputClass} />
            </Field>
            <Field>
              <input type="email" name="from_email" value={formData.from_email} onChange={handleLeadChange} required placeholder="What's your mail?* (mail@example.com)" className={inputClass} />
            </Field>
          </div>
          <div className="mt-5">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleLeadChange}
              rows={3}
              placeholder="Anything else we should know? (Inspirations, concerns, ideas - anything...)"
              className={`${inputClass} h-auto resize-none`}
            />
          </div>
        </section>

        <div className="flex justify-end gap-4 border-t border-gray-200 pt-4 dark:border-[#243244]">
          <button type="button" onClick={() => navigate("/clients")} className="rounded-lg border border-gray-300 px-5 py-2 dark:border-gray-600">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting ? "Saving..." : "Send Project Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
      {children}
    </label>
  );
}
