export const defaultTerms = [
  "This invoice only covers the services provided by Austin Legacy Corp and does not include any print and production costs.",
  "The Client agrees to pay a 50% (fifty percent) deposit upfront before work commences. Work will not commence until the deposit has been paid via bank transfer.",
  "The remaining balance of the agreed quote must be paid within 7 (seven) days after completion and delivery of the work.",
  "The cost of project management is not included in this invoice.",
  "If project management is required, it will be charged separately as communicated to Client in requirements as assessed by Austin Legacy Corp.",
  "Late payments may be subject to interest charges at the rate of 10% (ten percent) per week of the total invoice.",
  "Any disputes regarding this invoice should be communicated to Austin Legacy Corp in writing within 3 (three) business days of the issued invoice date.",
  "Austin Legacy Corp reserves the right to suspend or terminate services, and retain handover of the rights, title and interest of product made by Austin Legacy Corp, if payment is not received within the specified time.",
  "This invoice and the services provided by Austin Legacy Corp shall be governed by and construed in accordance with the applicable law. By accepting this invoice, you agree to these terms and conditions.",
]
  .map((text, i) => `${i + 1}. ${text}`)
  .join("\n\n");
export const defaultSettings = {
  company: {
    name: "Austin Legacy Corp",
    tagline: "INVESTING IN THE NEXT CENTURY",
    address: "",
    email: "",
    phone: "",
    taxId: "",
    logo: "",
    paymentQr: "",
  },
  paymentDetails: {
    method: "Bank Transfer",
    bankName: "AU SMALL FINANCE BANK",
    accountName: "AUSTIN LEGACY CORP",
    accountNumber: "2602220017926460",
    ifscCode: "AUBL0002220",
  },
  termsAndConditions: defaultTerms,
  paymentTerms: "Balance payable within 7 days",
  dueDays: 7,
  taxPercentage: 0,
};
export const statuses = ["Draft", "Sent", "Paid", "Overdue", "Cancelled"];
export const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;
export function calculate(items, taxPercentage) {
  const computed = items.map((item) => ({
    ...item,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    amount: roundMoney(Number(item.quantity) * Number(item.rate)),
  }));
  const subtotal = roundMoney(
    computed.reduce((sum, item) => sum + item.amount, 0),
  );
  const taxAmount = roundMoney((subtotal * Number(taxPercentage)) / 100);
  return {
    items: computed,
    subtotal,
    taxAmount,
    total: roundMoney(subtotal + taxAmount),
  };
}
export function validateInvoice(data) {
  const errors = [];
  if (!data || typeof data !== "object" || Array.isArray(data))
    return ["Invoice data is required."];
  const stringFields = {
    invoiceNumber: 100,
    referenceNumber: 100,
    paymentTerms: 200,
    termsAndConditions: 60000,
  };
  for (const [key, limit] of Object.entries(stringFields))
    if (
      data[key] != null &&
      (typeof data[key] !== "string" || data[key].length > limit)
    )
      errors.push(`${key} must be text of at most ${limit} characters.`);
  for (const [section, keys] of Object.entries({
    company: [
      "name",
      "tagline",
      "address",
      "email",
      "phone",
      "taxId",
      "logo",
      "paymentQr",
    ],
    client: ["name", "company", "address", "email", "taxId"],
    paymentDetails: [
      "method",
      "bankName",
      "accountName",
      "accountNumber",
      "ifscCode",
    ],
  })) {
    if (
      !data[section] ||
      typeof data[section] !== "object" ||
      Array.isArray(data[section])
    ) {
      errors.push(`${section} is required.`);
      continue;
    }
    for (const key of keys) {
      const value = data[section][key];
      const limit = ["logo", "paymentQr"].includes(key)
        ? 1500000
        : key === "address"
          ? 500
          : 150;
      if (value != null && (typeof value !== "string" || value.length > limit))
        errors.push(
          `${section}.${key} must be text of at most ${limit} characters.`,
        );
    }
  }
  for (const key of ["logo", "paymentQr"]) {
    if (
      data.company?.[key] &&
      (typeof data.company[key] !== "string" ||
        !/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(
          data.company[key],
        ))
    )
      errors.push(
        `Company ${key === "logo" ? "logo" : "payment QR"} must be a PNG or JPEG image.`,
      );
  }
  if (
    data.dueDays != null &&
    (!Number.isInteger(Number(data.dueDays)) ||
      Number(data.dueDays) < 0 ||
      Number(data.dueDays) > 3650)
  )
    errors.push("Due days must be a whole number between 0 and 3650.");
  if (errors.length) return errors;
  if (
    typeof data.invoiceNumber !== "string" ||
    !data.invoiceNumber.trim() ||
    data.invoiceNumber.length > 100 ||
    !/^[a-zA-Z0-9_-]+$/.test(data.invoiceNumber)
  )
    errors.push(
      "Invoice number is required (letters, numbers, hyphens and underscores; maximum 100 characters).",
    );
  for (const key of ["invoiceDate", "dueDate"])
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(data[key] || "") ||
      !Number.isFinite(Date.parse(data[key])) ||
      new Date(data[key]).toISOString().slice(0, 10) !== data[key]
    )
      errors.push(
        `${key === "invoiceDate" ? "Invoice date" : "Due date"} must be a valid date.`,
      );
  if (data.dueDate < data.invoiceDate)
    errors.push("Due date cannot precede invoice date.");
  if (typeof data.client?.name !== "string" || !data.client.name.trim())
    errors.push("Client name is required.");
  if (
    data.client?.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client.email)
  )
    errors.push("Enter a valid client email.");
  if (
    !Array.isArray(data.items) ||
    !data.items.length ||
    data.items.length > 500
  )
    errors.push("Include between 1 and 500 invoice items.");
  else
    data.items.forEach((item, i) => {
      if (!item || typeof item !== "object") {
        errors.push(`Item ${i + 1} is invalid.`);
        return;
      }
      if (
        typeof item.description !== "string" ||
        !item.description.trim() ||
        item.description.length > 10000
      )
        errors.push(`Item ${i + 1}: description is required.`);
      if (
        item.quantity === "" ||
        !Number.isFinite(Number(item.quantity)) ||
        Number(item.quantity) <= 0 ||
        Number(item.quantity) > 1e9
      )
        errors.push(
          `Item ${i + 1}: quantity must be greater than zero and no more than 1,000,000,000.`,
        );
      if (
        item.rate === "" ||
        !Number.isFinite(Number(item.rate)) ||
        Number(item.rate) < 0 ||
        Number(item.rate) > Number.MAX_SAFE_INTEGER / 100
      )
        errors.push(
          `Item ${i + 1}: rate must be between zero and 90,071,992,547,409.91.`,
        );
    });
  if (
    data.taxPercentage === "" ||
    !Number.isFinite(Number(data.taxPercentage)) ||
    Number(data.taxPercentage) < 0
  )
    errors.push("Tax percentage must be zero or greater.");
  if (
    data.paymentDetails?.accountNumber &&
    !/^\d{6,34}$/.test(data.paymentDetails.accountNumber)
  )
    errors.push("Account number must contain 6–34 digits.");
  if (
    data.paymentDetails?.ifscCode &&
    !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.paymentDetails.ifscCode)
  )
    errors.push("Enter a valid IFSC code.");
  if (!statuses.includes(data.status))
    errors.push("Select a valid invoice status.");
  if (
    !errors.length &&
    Array.isArray(data.items) &&
    data.items.length &&
    !Number.isSafeInteger(
      Math.round(calculate(data.items, data.taxPercentage).total * 100),
    )
  )
    errors.push("Invoice total exceeds the supported amount.");
  return errors;
}
