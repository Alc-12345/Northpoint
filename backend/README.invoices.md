# Finance invoices

Open **Finance → Invoices** (`/finance/invoices`) as an admin or superadmin. Existing Finance pages and links are retained.

The JavaScript implementation uses the existing Express authentication middleware, Mongoose connection, Axios client, Tailwind styles, and installed Sonner/PDF libraries. No environment variables or external PDF service are required.

## Workflow

Create an invoice, configure company branding/contact details, add client details and items, select tax and status, and save. Use **Save company defaults** in the form to reuse company, bank, terms, tax, and payment settings on future invoices. Previously saved invoices keep their own snapshots. The supplied bank details and all nine terms are the initial defaults; the actual company logo/address/contact details should be configured in the form.

The list supports search and invoice number, client, date, and status filters. Each row supports view, edit, PDF download, and confirmed deletion. The preview embeds the generated PDF itself, with edit, download, print, open, and close actions. The Open PDF action provides a native viewer fallback on mobile/browser configurations without embedded PDF support.

## API

All routes require a bearer token and the existing admin/superadmin authorization:

- `POST /api/invoices`
- `GET /api/invoices`
- `GET /api/invoices/:id`
- `PUT /api/invoices/:id`
- `DELETE /api/invoices/:id`
- `GET /api/invoices/settings`
- `PUT /api/invoices/settings`

PDF generation runs in the browser using `pdf-lib`, so a server PDF route is not needed. Files download as `INV-{invoiceNumber}.pdf`. The white A4 renderer uses embedded, licensed Noto Sans fonts for selectable Latin text and rupee symbols. Unsupported scripts produce an explicit error. It wraps table rows and terms across pages, repeats table headings, and keeps the totals block together. No HTML screenshots are used.

The `Invoice` collection has a unique invoice number index, timestamps, and creator/updater IDs. The API recalculates item amounts and totals and ignores client-supplied calculated amounts. `InvoiceSettings` stores the company defaults. Collections are created by Mongoose on first use.

## Checks

From the repository root:

```sh
node --test backend/tests/invoices.test.js frontend/src/utils/invoicePdf.test.mjs
```

API tests use an isolated MongoMemoryServer database. PDF tests load embedded fonts, validate A4 output, assert text stays within page bounds, and exercise long descriptions, many items, and multi-page terms. Browser/OS print behavior should additionally be verified in the deployment environment.
