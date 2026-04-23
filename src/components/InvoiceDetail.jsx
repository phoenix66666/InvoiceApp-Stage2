import { useState } from 'react';
import StatusBadge from './StatusBadge';
import DeleteModal from './DeleteModal';
import { fmtDate, fmtCurrency } from '../utils/helpers';
import './InvoiceDetail.css';

const BackArrow = () => (
  <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
    <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

/**
 * Full-page detail view for a single invoice.
 * Shows all invoice data, items table, grand total, and action buttons.
 */
function InvoiceDetail({ invoice, onBack, onEdit, onDelete, onMarkPaid }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const actionButtons = (
    <>
      {invoice.status !== 'paid' && (
        <button className="btn btn-secondary " onClick={() => onEdit(invoice)}>
          Edit
        </button>
      )}
      <button className="btn btn-danger " onClick={() => setShowDeleteModal(true)}>
        Delete
      </button>
      {invoice.status === 'pending' && (
        <button className="btn btn-primary " onClick={() => onMarkPaid(invoice.id)}>
          Mark as Paid
        </button>
      )}
      {invoice.status === 'draft' && (
        <button className="btn btn-primary " onClick={() => onMarkPaid(invoice.id, 'pending')}>
          Send Invoice
        </button>
      )}
    </>
  );

  return (
    <div className="page" style={{ paddingBottom: 120 }}>
      {/* ── Go back ── */}
      <button className="go-back" onClick={onBack} aria-label="Back to invoices">
        <BackArrow />
        <span>Go back</span>
      </button>

      {/* ── Status / action bar ── */}
      <div className="detail-card">
        <div className="detail-status-bar">
          <div className="detail-status-label">
            <span>Status</span>
            <StatusBadge className="mobile-badge" status={invoice.status} />
          </div>
          <div className="detail-actions">{actionButtons}</div>
        </div>
      </div>

      <div className="info-container">
        {/* ── Main info card ── */}

        <div className="detail-card">
          {/* Top row */}
          <div className="detail-top">
            <div>
              <p className="detail-id">
                <span>#</span>{invoice.id}
              </p>
              <p className="detail-desc">{invoice.description}</p>
            </div>
            <address className="detail-address">
              <span>{invoice.senderAddress.street}</span><br />
              <span>{invoice.senderAddress.city}</span><br />
              <span>{invoice.senderAddress.postCode}</span><br />
              <span>{invoice.senderAddress.country}</span>
            </address>
          </div>
         
            <div className="middle-info">
              {/* Meta grid */}
              <div className="detail-meta-grid">
                {/* Dates */}
                <div>
                  <p className="detail-meta-label">Invoice Date</p>
                  <p className="detail-meta-value">{fmtDate(invoice.createdAt)}</p>
                  <p className="detail-meta-label" style={{ marginTop: 24 }}>Payment Due</p>
                  <p className="detail-meta-value">{fmtDate(invoice.paymentDue)}</p>
                </div>

                {/* Bill to */}
                <div>
                  <p className="detail-meta-label">Bill To</p>
                  <p className="detail-meta-value">{invoice.clientName}</p>
                  <address className="detail-client-address">
                    <span>{invoice.clientAddress.street}</span><br />
                    <span>{invoice.clientAddress.city}</span><br />
                    <span>{invoice.clientAddress.postCode}</span><br />
                    <span>{invoice.clientAddress.country}</span>
                  </address>
                </div>
              </div>
              {/* Sent to */}
              <div className="sendTo">
                <p className="detail-meta-label">Sent To</p>
                <p className="detail-meta-value" >
                  {invoice.clientEmail}
                </p>
              </div>
            </div>
          
        </div>
        {/* Items table */}
        <div className="items-table-wrap">
          <table className="items-table" aria-label="Invoice items">
            <thead>
              <tr>
                <th>Item Name</th>
                <th style={{ textAlign: 'center' }}>QTY.</th>
                <th style={{ textAlign: 'right' }}>Price</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id || item.name}>
                  <td style={{ textAlign: 'left' }}>{item.name}</td>
                  <td className="muted" style={{ textAlign: 'center' }}>
                    {item.quantity}
                  </td>
                  <td className="muted" style={{ textAlign: 'right' }}>
                    {fmtCurrency(item.price)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {fmtCurrency(
                      (Number(item.quantity) || 0) * (Number(item.price) || 0)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="items-table-wrap-mobile">
          <table className="items-table" aria-label="Invoice items">
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id || item.name}>
                  <td>
                    <div className="td-span-container">
                      <span>{item.name}</span>
                      <span className="muted" >
                        {item.quantity} * {fmtCurrency(item.price)}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {fmtCurrency(
                      (Number(item.quantity) || 0) * (Number(item.price) || 0)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grand total */}
        <div className="total-bar">
          <span className="total-bar__label">Grand Total</span>
          <span className="total-bar__amount">{fmtCurrency(invoice.total)}</span>
        </div>
      </div>

      {/* ── Mobile footer ── */}
      <div className="detail-footer-mobile">{actionButtons}</div>

      {/* ── Delete confirmation ── */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={() => {
            onDelete(invoice.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}

export default InvoiceDetail;
