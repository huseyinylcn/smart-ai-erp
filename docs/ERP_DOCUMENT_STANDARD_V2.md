# ERP Document UI/UX Standard (V2) - Unified Internal Design

This document establishes the official 14-point architectural standard for all "Document" pages (Create, Detail, Edit) within the SmartAgent ERP system. Adherence to this standard ensures a premium, predictable, and audit-ready user experience across Sales, Purchase, Finance, HRM, and Inventory modules.

---

## 1. Header (Identity & Primary Actions)
- **Purpose**: Global control center for the document. Displays identity and provides immediate actions.
- **Header Buttons**: 
  - `[Back]` (ArrowLeft - Secondary)
  - `[Save/Update]` (Primary - Save icon)
  - `[Approve/Post]` (Primary - Send/Check icon)
  - `[Print/Export]` (Secondary - Printer icon)
  - `[Share/Email]` (Secondary - Share icon)
  - `[Full Screen]` (Utility - Maximize icon)
- **Placement**: Top (Fixed/Sticky).
- **Stickiness**: **Always Sticky** to ensure actions are always available while scrolling.

## 2. Basic Info Section
- **Purpose**: Unique sequence and timing data for the ERP ledger.
- **Fields**: Document Sequence Number (Read-only), Entry Date (Selectable), Operation Type.
- **Placement**: Left Column (9/12) - Top.
- **Collapsible**: No (Critical).

## 3. Counterparty / Company Info Section
- **Purpose**: Defining the "Who" behind the transaction (Customer, Vendor, or Employee).
- **Fields**: Legal Name, VÖEN/Tax ID (Auto-complete), Address (Summary), Contact Person.
- **Placement**: Left Column (9/12) - Below Basic Info.
- **Collapsible**: No (Contextual anchor).

## 4. Warehouse / Branch / Currency Section
- **Purpose**: Operational context and financial parameters.
- **Fields**: Source Warehouse, Target Warehouse (for transfers), Branch (Filial), Currency (AZN/USD/EUR), Exchange Rate (Manual/API).
- **Placement**: Left Column (9/12).
- **Collapsible**: Yes (If defaults are used).

## 5. Dates and Reference Section
- **Purpose**: Additional timing info and cross-system links.
- **Fields**: Due Date (Valuta), Delivery Date, Project Code, Contract Number, Reference (Original Doc).
- **Placement**: Left Column (9/12) - Bottom of the info group.
- **Collapsible**: **Yes (Recommended)**.

---

## 6. Line Items Grid (Məhsullar)
- **Purpose**: The "What" of the document. Detailed itemized breakdown.
- **Fields**: Product ID, SKU, Name/Description, Unit (Measure), Quantity, Unit Price, Discount %, Tax %, Total.
- **Placement**: Left Column (9/12) - Full width of column.
- **Collapsible**: No.
- **Stickiness**: Grid header should be sticky when scrolling long lists.

---

## 7. Totals Summary (Maliyyə Xülasəsi)
- **Purpose**: Real-time snapshot of the document's total impact.
- **Fields**: Subtotal (Net), Total Discount, Service/Transport costs, Total Tax (ƏDV), **Grand Total (Yekun)**.
- **Placement**: **Right Sidebar (3/12)** - Top.
- **Stickiness**: **Sticky** during grid scroll.

## 8. Tax / VAT Section
- **Purpose**: Specific tax reporting details.
- **Fields**: VAT Exemptions, Tax Category, Special Tax Rates.
- **Placement**: Right Sidebar (3/12) - Center.
- **Collapsible**: **Yes**.

## 9. Payment / Settlement Section
- **Purpose**: How and when the money will be settled.
- **Fields**: Payment Terms (e.g., 30 days net), Payment Method (Bank/Cash/Offset), Bank Account.
- **Placement**: Right Sidebar (3/12) - Center.
- **Collapsible**: **Yes**.

## 10. Notes / Internal Notes
- **Purpose**: Qualitative context for users/auditors.
- **Fields**: Description (External - prints on invoice), Internal Comments (Internal - only in ERP).
- **Placement**: Right Sidebar (3/12) - Bottom.
- **Collapsible**: **Yes**.

---

## 11. Attachments (Fayllar)
- **Purpose**: Supporting documentation (Scans, PDFs, Images).
- **Placement**: **Lower Tab System**.
- **Collapsible**: Tabbed interaction.

## 12. Linked Documents (Əlaqəli Sənədlər)
- **Purpose**: Navigating the document chain (e.g., Order -> Invoice -> Return).
- **Placement**: **Lower Tab System**.

## 13. Approval History (Təsdiqlər)
- **Purpose**: Tracking the internal workflow and approvals.
- **Placement**: **Lower Tab System**.

## 14. Audit Trail (Tarixçə)
- **Purpose**: Security and forensic logging (User, Action, Timestamp).
- **Placement**: **Lower Tab System** (Final Tab).

---

## Layout Rules Summary:
1.  **Main Layout**: 12-column grid. Col 1-9 (Left), Col 10-12 (Right Sidebar).
2.  **Color Palette**: Premium Indigo for Actions, Emerald for Success/Income, Rose for Errors/Expenses.
3.  **Typography**: Inter/Roboto, Weight 900 for Titles (H1), Weight 700 for Section Headers.
4.  **Animations**: Fade-in (500ms) on load, Slide-in on Tab switch.
