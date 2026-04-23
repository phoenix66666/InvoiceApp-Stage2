# Invoice App

A fully responsive Invoice Management Application built with React and Vite. Create, read, update, and delete invoices — with draft/pending/paid status flow, status filtering, and a light/dark theme toggle. Data is persisted in the browser via `localStorage`.

---



## Features

- **Full CRUD** — Create, view, edit, and delete invoices
- **Status workflow** — Draft → Pending → Paid 
- **Save as Draft** — save an invoice as draft
- **Filter by status** — Filter invoices by Draft, Pending, or Paid
- **Form validation** — Required fields, email format, positive quantities/prices etc.
- **Delete confirmation** — Modal prompt before permanently removing an invoice
- **Light / Dark mode** — Global theme toggle, preference stored in `localStorage`
- **Responsive design** — Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Hover & focus states** — All interactive elements have visible hover and keyboard focus styles
- **Persistent data** — Invoices and theme preference saved to `localStorage`
- **Accessible markup** — Semantic HTML, ARIA roles, keyboard navigation on invoice cards


---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later (or `pnpm` / `yarn`)

### Installation

```bash
# 1. Clone or download the project
git clone https://github.com/your-username/invoice-app.git
cd invoice-app

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

---

## Project Structure

```
invoice-app/
├── index.html                  # Vite HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
└── src/
    ├── main.jsx                # React root — mounts <App />
    ├── App.jsx                 # Root component, global state & routing
    │
    ├── context/
    │   └── ThemeContext.js     # React context for dark/light theme
    │
    ├── utils/
    │   ├── helpers.js          # Pure utility functions (date, currency, uid…)
    │   └── data.js             # Sample invoice seed data
    │
    ├── styles/
    │   └── global.css          # CSS reset, theme tokens, layout helpers
    │ 
    │
    └── components/
        ├── Sidebar.jsx         # Fixed nav bar — logo, theme toggle, avatar
        ├── Sidebar.css         # component css
        ├── StatusBadge.jsx     # Coloured pill: Paid / Pending / Draft
        ├── StatusBadge.css     # component css
        ├── Filter.jsx          # Checkbox dropdown for status filtering
        ├── Filter.css          # component css
        ├── EmptyState.jsx      # Illustration shown when no invoices match
        ├── EmptyState.css      # component css
        ├── DeleteModal.jsx     # Confirmation dialog before deletion
        ├── DeleteModal.css     # component css
        ├── InvoiceList.jsx     # List page — header + filterable invoice cards
        ├── InvoiceList.css     # component css
        ├── InvoiceDetail.jsx   # Detail page — full invoice info + actions
        ├── InvoiceDetail.css   # component css 
        ├── InvoiceForm.jsx     # Slide-in drawer — create / edit form
        └── InvoiceForm.css     # component css
        
```

---

## Component Reference

### `App.jsx`
The root component. Owns all invoice state and persists it to `localStorage`. Acts as a simple page router between the list and detail views and passes handlers down as props.

### `Sidebar`
Fixed navigation panel. Renders on the left on desktop and along the top on mobile. Contains the app logo, a light/dark toggle button, and a user avatar.


### `StatusBadge`
Displays a coloured pill badge. Reads the current theme from `ThemeContext` to adjust the Draft colour.


### `Filter`
A button that reveals a checkbox dropdown for filtering invoices by status. Manages its own open/closed state; closes on outside click.


### `InvoiceList`
The main list page. Renders the page header, the `Filter` dropdown, and all matching invoice cards. Shows `EmptyState` when nothing matches.


### `InvoiceDetail`
Full detail view for one invoice. Renders address blocks, an items table, grand total, and action buttons (Edit / Delete / Mark as Paid / Send Invoice). Action buttons are duplicated in a sticky mobile footer.


### `InvoiceForm`
Slide-in drawer for creating or editing an invoice. Performs full validation before calling `onSavePending`; bypasses validation when saving as a draft.


### `DeleteModal`
A confirmation dialog rendered over a dimmed overlay. Clicking the overlay dismisses it.


### `EmptyState`
A purely visual component with an SVG illustration and helper text. 

---

## Utility Functions (`src/utils/helpers.js`)

Contains helper functions.

---

## Theme tokens

The `.dark` / `.light` class is applied to the root `.app-root` element and cascades all custom properties automatically:


---

## Trade-offs & Design Decisions

### `localStorage` instead of a backend
**What we gain:** Zero infrastructure. The app runs entirely in the browser with no server, no database, and no authentication layer. It works offline and is easy to deploy as a static site.

**What we give up:** The 5–10 MB storage quota also means the app would start failing silently if someone created hundreds of large invoices.

### No TypeScript
**What we gain:** Faster initial development. 

**What we give up:** Bugs from shape mismatches only surface at runtime.