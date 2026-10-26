# Finance invoices

Open **Finance → Invoices** (`/finance/invoices`) as an admin or superadmin. Existing Finance pages and links are retained.

The JavaScript implementation uses the existing Express authentication middleware, Mongoose connection, Axios client, Tailwind styles, and installed Sonner/PDF libraries. A server-only `INVOICE_ENCRYPTION_KEY` is required for invoice amounts; no external PDF service is required.

## Workflow

Use **Company Settings** on the invoice list to configure the logo, payment QR image, company name, address, phone, email and GST once. Every new invoice automatically uses these saved details; the invoice form shows a read-only company summary. Create an invoice, add client details and items, select tax and status, and save. Use **Save payment / tax / terms defaults** in the invoice form to reuse bank, terms, tax, and payment settings on future invoices. Previously saved invoices keep their own snapshots. The supplied bank details and all nine terms are the initial defaults; the actual company logo/address/contact details should be configured in the form.

The list supports search and invoice number, client, date, and status filters. Each row supports view, edit, PDF download, and confirmed deletion. The preview embeds the generated PDF itself, with edit, download, print, open, and close actions. The Open PDF action provides a native viewer fallback on mobile/browser configurations without embedded PDF support.

The login page’s **Admin Panel** shortcut opens a tokenless preview. In that mode, invoice CRUD and company defaults use isolated session storage; no live invoice endpoints are called. A visible banner identifies preview data, which is cleared when leaving the session. Non-admin preview roles cannot access the invoice store. Sign in with real administrator credentials to persist invoices in MongoDB.

## API

All routes require a bearer token and the existing admin/superadmin authorization:

- `POST /api/invoices`
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`
- `GET /api/invoices/settings`
- `PUT /api/invoices/settings`

PDF generation runs in the browser using `pdf-lib`, so a server PDF route is not needed. Files download as `INV-{invoiceNumber}.pdf`. The white A4 renderer uses embedded, licensed Noto Sans fonts for selectable Latin text and rupee symbols. Unsupported scripts produce an explicit error. The compact layout fits a standard invoice with three items, company logo/contact details, and the nine default terms on one A4 page. It uses the largest terms font that fits, with an 8.5 pt minimum. Longer invoices still wrap table rows and terms across pages, repeat table headings, and keep the totals block together. The layout uses smaller margins, shaded uppercase headings, dividers between FROM / BILL TO / invoice details, stacked issue/due dates, Indian currency amount in words, and an uploaded payment QR below the bank details. Payment terms are omitted from the invoice form and PDF. No HTML screenshots are used.

The `Invoice` collection has a unique invoice number index, timestamps, and creator/updater IDs. The API recalculates item amounts and totals and ignores client-supplied calculated amounts. `InvoiceSettings` stores the company defaults. Collections are created by Mongoose on first use.

## Checks

From the repository root:

```sh
node --test backend/tests/invoices.test.js frontend/src/utils/invoicePdf.test.mjs
```

API tests use an isolated MongoMemoryServer database. PDF tests load embedded fonts, validate A4 output, assert text stays within page bounds, and exercise long descriptions, many items, and multi-page terms. Browser/OS print behavior should additionally be verified in the deployment environment.

## Amount security and deployment

Set `INVOICE_ENCRYPTION_KEY` to a securely generated 32-byte key encoded as 64 hex characters (see `.env.example`). Keep it in the backend secret store and back it up securely. Never expose it through Vite variables or browser code. Losing this key makes encrypted invoices unreadable; changing it requires decrypting and re-encrypting existing records with the old and new keys.

New and updated invoices store line items (including rates, quantities, discounts and amounts), subtotal, tax percentage, tax amount and total in an AES-256-GCM authenticated encrypted envelope. Each write uses a random IV, and authentication binds the envelope to its invoice number. The backend reveals saved financial fields only after admin/superadmin authorization and invoice-password verification. An administrator sets the shared password once using Set Invoice Password; it cannot be overwritten. Only a salted scrypt hash is stored. Decrypt Amounts issues a user-bound 15-minute grant held in browser memory; Lock Amounts clears the grant and visible financial data. Locked list, detail and create responses omit financial fields, including legacy plaintext values. Editing existing invoices requires a grant. Password verification is rate limited. Responses use `Cache-Control: no-store`. Live invoice data is held in browser memory for authorized display and PDF creation. Use HTTPS for the frontend and API in deployment; readable amounts necessarily exist in an authorized administrator's browser and exported PDFs. Preview session storage contains demo data only; do not enter confidential invoices in tokenless preview mode.

Existing plaintext invoices remain readable for compatibility. Before enabling the new version, back up the database and run `cd backend && node scripts/encryptInvoiceAmounts.js` during a maintenance window with the encryption key and database URI configured. This removes plaintext financial fields from existing records. Existing database backups retain their prior contents. The migration is safe to rerun. New writes fail if the key is missing or invalid.
