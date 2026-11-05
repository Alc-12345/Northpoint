export const documentCompanyFields = {
  companyName: "name",
  companyAddress: "address",
  companyEmail: "email",
  companyPhone: "phone",
  companyGstin: "taxId",
  companyTagline: "tagline",
  invoiceTerms: "termsAndConditions",
};

export const usesInvoiceCompany = type => ["quotation", "commercials"].includes(type);

export function withDocumentCompany(document, company) {
  if (!usesInvoiceCompany(document.type) || !company) return document;
  return {
    ...document,
    company,
    paymentDetails: company.paymentDetails || {},
    values: {
      ...document.values,
      ...Object.fromEntries(Object.entries(documentCompanyFields).map(([field, key]) => [field, company[key] || ""])),
      companyWebsite: "",
    },
  };
}
