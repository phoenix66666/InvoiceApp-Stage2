import { useState } from 'react';
import StatusBadge from './StatusBadge';
import Filter from './Filter';
import EmptyState from './EmptyState';
import { fmtDate, fmtCurrency } from '../utils/helpers';
import './InvoiceList.css';
import plusIcon from '../assets/plusIcon.svg'

const PlusIcon = () => (
  <img src={plusIcon} alt="plusIcon"></img>
);

/**
 * Main invoice list page.
 * Shows a filterable list of invoice cards; empty state when nothing matches.
 */
function getVisibleInvoices(invoices, filter) {
  if (filter.includes("all")) { return invoices }
  else {
    return (filter.length === 0
      ? invoices
      : invoices.filter((inv) => filter.includes(inv.status))
    )
  }
}

function InvoiceList({ invoices, onSelect, onNew }) {
  const [filter, setFilter] = useState([]);


  const visible = getVisibleInvoices(invoices, filter) 


  const countLabel =
    visible.length === 0
      ? 'No invoices'
      : `${visible.length} invoice${visible.length !== 1 ? 's' : ''}`;

  return (
    <div className="page">
      {/* ── Header ── */}
      <header className="page-header">
        <div>
          <h1 className="page-header__title">Invoices</h1>
          <p className="page-header__count">{countLabel}</p>
        </div>

        <div className="page-header__right">
          <Filter filter={filter} setFilter={setFilter} />

          <button className="btn btn-primary" onClick={onNew}>
            <span className="new-btn-icon">
              <PlusIcon />
            </span>
            <span className="label-full">New Invoice</span>
            <span className="label-short">New</span>
          </button>
        </div>
      </header>

      {/* ── List / empty state ── */}
      {visible.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="invoice-list" role="list">
          {visible.map((inv) => (
            <li key={inv.id} style={{ listStyle: 'none' }}>
              <article
                className="invoice-card desktop"
                onClick={() => onSelect(inv.id)}
                role="button"
                tabIndex={0}
                aria-label={`Invoice ${inv.id}, ${inv.status}`}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(inv.id)}
              >
                <div className="invoice-card__left">
                  <p className="invoice-card__id">
                    <span>#</span>{inv.id}
                  </p>
                  <p className="invoice-card__meta">Due {fmtDate(inv.paymentDue)}</p>
                  <p className="invoice-card__meta">{inv.clientName}</p>
                </div>

                <div className="invoice-card__right">
                  <p className="invoice-card__amount">{fmtCurrency(inv.total)}</p>
                  <StatusBadge status={inv.status} />
                </div>
              </article>

                <article
                className="invoice-card mobile"
                onClick={() => onSelect(inv.id)}
                role="button"
                tabIndex={0}
                aria-label={`Invoice ${inv.id}, ${inv.status}`}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(inv.id)}
              >
                <div className="invoice-card__left">
                  <p className="invoice-card__id">
                    <span>#</span>{inv.id}
                  </p>
                  <p className="invoice-card__meta">Due {fmtDate(inv.paymentDue)}</p>
                  <p className="invoice-card__amount">{fmtCurrency(inv.total)}</p>
                  
                </div>

                <div className="invoice-card__right">
                  <p className="invoice-card__meta">{inv.clientName}</p>
                  <StatusBadge status={inv.status} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InvoiceList;
