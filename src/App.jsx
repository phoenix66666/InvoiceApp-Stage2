import { useState, useEffect, useCallback } from 'react';

import { ThemeContext }  from './context/ThemeContext';
import Sidebar           from './components/Sidebar';
import InvoiceList       from './components/InvoiceList';
import InvoiceDetail     from './components/InvoiceDetail';
import InvoiceForm       from './components/InvoiceForm';

//import { uid, addDays, calcTotal } from './utils/helpers';
import SAMPLE_INVOICES             from './utils/data';

import './styles/global.css';


/* ─────────────────────────────────────────
   Helpers for localStorage with fallbacks
───────────────────────────────────────── */
function loadTheme() {
  try { return localStorage.getItem('invoice-theme') === 'dark'; }
  catch { return true; }
}

function loadInvoices() {
  try {
    const saved = localStorage.getItem('invoice-data');
    return saved ? JSON.parse(saved) : SAMPLE_INVOICES;
    
  } catch {
    return SAMPLE_INVOICES;
  }
}

/* ─────────────────────────────────────────
   Root application component
───────────────────────────────────────── */
function App() {
  /* ── State ── */
  const [dark, setDark]         = useState(loadTheme);
  const [invoices, setInvoices] = useState(loadInvoices);
  const [page, setPage]         = useState('list');   // 'list' | 'detail'
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm]     = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  /* ── Persist to localStorage ── */
  useEffect(() => {
    try { localStorage.setItem('invoice-data', JSON.stringify(invoices)); }
    catch { /* quota exceeded – ignore */ }
  }, [invoices]);

  useEffect(() => {
    try { localStorage.setItem('invoice-theme', dark ? 'dark' : 'light'); }
    catch { /* quota exceeded – ignore */ }
  }, [dark]);

  /* ── Derived ── */
  const selectedInvoice = invoices.find((inv) => inv.id === selectedId) ?? null;

  /* ── CRUD handlers ── */
  const handleSave = useCallback((invoice) => {
    setInvoices((prev) => {
      const idx = prev.findIndex((inv) => inv.id === invoice.id);
      return idx >= 0
        ? prev.map((inv) => (inv.id === invoice.id ? invoice : inv))
        : [invoice, ...prev];
    });
    setShowForm(false);
    setEditInvoice(null);
  }, []);

  const handleDelete = useCallback((id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setPage('list');
    setSelectedId(null);
  }, []);

  const handleMarkPaid = useCallback((id, status = 'paid') => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  }, []);

  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setPage('detail');
  }, []);

  const handleEdit = useCallback((invoice) => {
    setEditInvoice(invoice);
    setShowForm(true);
  }, []);

  const handleNewInvoice = () => {
    setEditInvoice(null);
    setShowForm(true);
  };

  /* ── Render ── */
  const themeClass = dark ? 'dark' : 'light';

  return (
    <ThemeContext.Provider value={{ dark }}>
      <div className={`app-root ${themeClass}`}>
        {/* Navigation sidebar */}
        <Sidebar
          dark={dark}
          onToggleTheme={() => setDark((d) => !d)}
        />

         { /*Page content */}
        <main className="main-content">
          {page === 'list' && (
            <InvoiceList
              invoices={invoices}
              onSelect={handleSelect}
              onNew={handleNewInvoice}
            />
          )}

          {page === 'detail' && selectedInvoice && (
            <InvoiceDetail
              invoice={selectedInvoice}
              onBack={() => setPage('list')}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkPaid={handleMarkPaid}
            />
          )}
        </main>
        {/* Invoice create / edit drawer */}
        <div className='showForm-container'>
        {showForm && (
          <InvoiceForm
            editInvoice={editInvoice}
            onClose={() => {
              setShowForm(false);
              setEditInvoice(null);
            }}
            onSaveDraft={handleSave}
            onSavePending={handleSave}
          />
        )}
        </div>

        
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
