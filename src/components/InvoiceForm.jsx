import { useState } from 'react';
import { uid, addDays, calcTotal, today } from '../utils/helpers';
import { fmtCurrency } from '../utils/helpers';
import './InvoiceForm.css';

/* ── Empty form factory ── */
const emptyForm = () => ({
  createdAt: today(),
  paymentTerms: 30,
  description: '',
  clientName: '',
  clientEmail: '',
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  items: [{ id: uid(), name: '', quantity: 1, price: 0, total: 0 }],
});

/* ── Small helpers ── */
const TrashIcon = () => (
  <svg width="13" height="16" viewBox="0 0 13 16" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.47 0L9.36.5H13v1H0V.5h3.64L4.53 0h3.94zM1 14.5V2h11v12.5c0 .83-.67 1.5-1.5 1.5h-8C1.67 16 1 15.33 1 14.5z"
    />
  </svg>
);

/* ── Sub-components ── */

/** Labelled form group with optional inline error */
function FormGroup({ label, errorKey, errors, children }) {
  return (
    <div className="form-group">
      <div className="form-label-row">
        <label className="form-label">{label}</label>
        {errors[errorKey] && (
          <span className="form-error-text">{errors[errorKey]}</span>
        )}
      </div>
      {children}
    </div>
  );
}

/** Single item row in the item list */
function ItemRow({ item, index, errors, onChangeItem, onRemove }) {
  const inputCls = (key) =>
    `form-input${errors[`item_${index}_${key}`] ? ' error' : ''}`;

  return (
    <div className="item-row">
      <input
        className={inputCls('name')}
        value={item.name}
        placeholder="Item name"
        onChange={(e) => onChangeItem(index, 'name', e.target.value)}
        aria-label="Item name"
      />
      <input
        type="number"
        min={1}
        className={inputCls('quantity')}
        value={item.quantity}
        style={{ textAlign: 'center', padding: '14px 6px' }}
        onChange={(e) => onChangeItem(index, 'quantity', e.target.value)}
        aria-label="Quantity"
      />
      <input
        type="number"
        min={0}
        step="0.01"
        className={inputCls('price')}
        value={item.price}
        style={{ textAlign: 'right', padding: '14px 8px' }}
        onChange={(e) => onChangeItem(index, 'price', e.target.value)}
        aria-label="Price"
      />
      <span className="item-total-text">
        {fmtCurrency((Number(item.quantity) || 0) * (Number(item.price) || 0))}
      </span>
      <button
        className="item-remove-btn"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        <TrashIcon />
      </button>
    </div>
  );
}


function ItemRowMobile({ item, index, errors, onChangeItem, onRemove }) {
  const inputCls = (key) =>
    `form-input${errors[`item_${index}_${key}`] ? ' error' : ''}`;

  return (
    <div className="item-row-mobile">
      <div className="item-name-mobile">
        <span className="form-label">Item Name</span>
        <input
          className={inputCls('name')}
          value={item.name}
          placeholder="Item name"
          onChange={(e) => onChangeItem(index, 'name', e.target.value)}
          aria-label="Item name"
        />
      </div>
      <div className="label-name-mobile">
        <span className="form-label" style={{ textAlign: 'center' }}>Qty.</span>
        <span className="form-label" style={{ textAlign: 'right' }}>Price</span>
        <span className="form-label" style={{ textAlign: 'right' }}>Total</span>
        <span />
      </div>
      <div className="item-input-mobile">
        <input
          type="number"
          min={1}
          className={inputCls('quantity')}
          value={item.quantity}
          style={{ textAlign: 'center', padding: '14px 6px' }}
          onChange={(e) => onChangeItem(index, 'quantity', e.target.value)}
          aria-label="Quantity"
        />

        <input
          type="number"
          min={0}
          step="0.01"
          className={inputCls('price')}
          value={item.price}
          style={{ textAlign: 'right', padding: '14px 8px' }}
          onChange={(e) => onChangeItem(index, 'price', e.target.value)}
          aria-label="Price"
        />
        <span className="item-total-text">
          {fmtCurrency((Number(item.quantity) || 0) * (Number(item.price) || 0))}
        </span>
      
      <button
        className="item-remove-btn"
        onClick={() => onRemove(item.id)}
        aria-label="Remove item"
      >
        <TrashIcon />
      </button>
      </div>
    </div>
  );
}

/* ── Main component ── */

/**
 * Slide-in drawer for creating or editing an invoice.
 * When `editInvoice` is provided the form is pre-populated.
 */
function InvoiceForm({ editInvoice, onClose, onSaveDraft, onSavePending }) {
  const [form, setForm] = useState(() =>
    editInvoice
      ? {
        ...editInvoice,
        items: editInvoice.items.map((i) => ({ ...i, id: i.id || uid() })),
      }
      : emptyForm()
  );
  const [errors, setErrors] = useState({});

  /* ── State helpers ── */
  const setField = (path, value) => {
    setForm((prev) => {
      const next = JSON.parse(JSON.stringify(prev));      // deep clone
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const updateItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        updated.total =
          (Number(updated.quantity) || 0) * (Number(updated.price) || 0);
        return updated;
      }),
    }));
  };

  const addItem = () =>
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uid(), name: '', quantity: 1, price: 0, total: 0 },
      ],
    }));

  const removeItem = (id) =>
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = 'Required';
    if (!form.clientEmail.trim()) e.clientEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) e.clientEmail = 'Invalid email';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.senderAddress.street.trim()) e['senderAddress.street'] = 'Required';
    if (!form.senderAddress.city.trim()) e['senderAddress.city'] = 'Required';
    if (!form.senderAddress.postCode.trim()) e['senderAddress.postCode'] = 'Required';
    if (!form.senderAddress.country.trim()) e['senderAddress.country'] = 'Required';
    if (!form.clientAddress.street.trim()) e['clientAddress.street'] = 'Required';
    if (!form.clientAddress.city.trim()) e['clientAddress.city'] = 'Required';
    if (!form.clientAddress.postCode.trim()) e['clientAddress.postCode'] = 'Required';
    if (!form.clientAddress.country.trim()) e['clientAddress.country'] = 'Required';
    if (form.items.length === 0) e.items = 'Add at least one item';
    form.items.forEach((item, idx) => {
      if (!item.name.trim()) e[`item_${idx}_name`] = 'Required';
      if (Number(item.quantity) <= 0) e[`item_${idx}_quantity`] = 'Must be > 0';
      if (Number(item.price) < 0) e[`item_${idx}_price`] = 'Must be ≥ 0';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Build invoice object ── */
  const buildInvoice = (status) => ({
    ...form,
    id: editInvoice?.id || uid(),
    status,
    paymentDue: addDays(form.createdAt, form.paymentTerms),
    total: calcTotal(form.items),
    items: form.items.map((item) => ({
      ...item,
      total: (Number(item.quantity) || 0) * (Number(item.price) || 0),
    })),
  });

  const handleSaveDraft = () => {
    if (validate())
      onSaveDraft(buildInvoice('draft'));
  };
  const handleSavePending = () => {
    if (validate())
      onSavePending(buildInvoice(editInvoice ? editInvoice.status : 'pending'));
  };

  const ic = (key) => `form-input${errors[key] ? ' error' : ''}`;

  return (
    <div className="edit-form">

      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        className="drawer scrollbar-thin"
        role="dialog"
        aria-modal="true"
        aria-label={editInvoice ? `Edit invoice #${editInvoice.id}` : 'New invoice'}
      >
        <h2 className="drawer__title">
          {editInvoice ? (
            <>Edit <span>#{editInvoice.id}</span></>
          ) : (
            'New Invoice'
          )}
        </h2>

        {/* ── Bill From ── */}
        <section className="drawer__section">
          <p className="drawer__section-heading">Bill From</p>

          <div className="form-group" style={{ marginBottom: 16 }}>
            <div className="form-label-row">
              <label className="form-label">Street Address</label>
              {errors['senderAddress.street'] && (
                <span className="form-error-text">{errors['senderAddress.street']}</span>
              )}
            </div>
            <input
              className={ic('senderAddress.street')}
              value={form.senderAddress.street}
              onChange={(e) => setField('senderAddress.street', e.target.value)}
            />
          </div>

          <div className="form-grid-3">
            {[
              { label: 'City', key: 'senderAddress.city' },
              { label: 'Post Code', key: 'senderAddress.postCode' },
              { label: 'Country', key: 'senderAddress.country' },
            ].map(({ label, key }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className={ic(key)}
                  value={key.split('.').reduce((o, k) => o[k], form)}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="form-grid-mobile">
            <div className="form-grid-mobile-line1">
              {[
                { label: 'City', key: 'senderAddress.city' },
                { label: 'Post Code', key: 'senderAddress.postCode' },

              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    className={ic(key)}
                    value={key.split('.').reduce((o, k) => o[k], form)}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="form-label">Country</label>
              <input
                className={ic('senderAddress.country')}
                value={'senderAddress.country'.split('.').reduce((o, k) => o[k], form)}
                onChange={(e) => setField('senderAddress.country', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── Bill To ── */}
        <section className="drawer__section">
          <p className="drawer__section-heading">Bill To</p>

          <FormGroup label="Client's Name" errorKey="clientName" errors={errors}>
            <input
              className={ic('clientName')}
              value={form.clientName}
              onChange={(e) => setField('clientName', e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Client's Email" errorKey="clientEmail" errors={errors}>
            <input
              type="email"
              className={ic('clientEmail')}
              value={form.clientEmail}
              placeholder="e.g. email@example.com"
              onChange={(e) => setField('clientEmail', e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Street Address" errorKey="clientAddress.street" errors={errors}>
            <input
              className={ic('clientAddress.street')}
              value={form.clientAddress.street}
              onChange={(e) => setField('clientAddress.street', e.target.value)}
            />
          </FormGroup>

          <div className="form-grid-3">
            {[
              { label: 'City', key: 'clientAddress.city' },
              { label: 'Post Code', key: 'clientAddress.postCode' },
              { label: 'Country', key: 'clientAddress.country' },
            ].map(({ label, key }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className={ic(key)}
                  value={key.split('.').reduce((o, k) => o[k], form)}
                  onChange={(e) => setField(key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="form-grid-mobile">
            <div className="form-grid-mobile-line1">
              {[
                { label: 'City', key: 'senderAddress.city' },
                { label: 'Post Code', key: 'senderAddress.postCode' },

              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    className={ic(key)}
                    value={key.split('.').reduce((o, k) => o[k], form)}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="form-label">Country</label>
              <input
                className={ic('senderAddress.country')}
                value={'senderAddress.country'.split('.').reduce((o, k) => o[k], form)}
                onChange={(e) => setField('senderAddress.country', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── Invoice meta ── */}
        <section className="drawer__section">
          <div className="form-grid-2" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Invoice Date</label>
              <input
                type="date"
                className="form-input"
                value={form.createdAt}
                onChange={(e) => setField('createdAt', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Terms</label>
              <select
                className="form-select"
                value={form.paymentTerms}
                onChange={(e) => setField('paymentTerms', Number(e.target.value))}
              >
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
          </div>

          <FormGroup label="Project Description" errorKey="description" errors={errors}>
            <input
              className={ic('description')}
              value={form.description}
              placeholder="e.g. Graphic Design Service"
              onChange={(e) => setField('description', e.target.value)}
            />
          </FormGroup>
        </section>

        {/* ── Item list ── */}
        <section className="item-list">
          <p className="drawer__items-heading">Item List</p>
          {errors.items && (
            <p className="form-error-text" style={{ marginBottom: 8 }}>
              {errors.items}
            </p>
          )}

          {/* Column headers */}
          <div className="item-row-header">
            <span className="form-label">Item Name</span>
            <span className="form-label" style={{ textAlign: 'center' }}>Qty.</span>
            <span className="form-label" style={{ textAlign: 'right' }}>Price</span>
            <span className="form-label" style={{ textAlign: 'right' }}>Total</span>
            <span />
          </div>

          <div className="drawer__items-list">
            {form.items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                index={index}
                errors={errors}
                onChangeItem={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>

          <button
            className="btn btn-secondary drawer__add-item-btn"
            onClick={addItem}
          >
            + Add New Item
          </button>
        </section>

        {/* ── Item list Mobile── */}
        <section className="item-list-mobile">
          <p className="drawer__items-heading">Item List</p>
          {errors.items && (
            <p className="form-error-text" style={{ marginBottom: 8 }}>
              {errors.items}
            </p>
          )}

          {/* Column headers */}

          <div className="drawer__items-list">
            {form.items.map((item, index) => (
              <ItemRowMobile
                key={item.id}
                item={item}
                index={index}
                errors={errors}
                onChangeItem={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>

          <button
            className="btn btn-secondary drawer__add-item-btn"
            onClick={addItem}
          >
            + Add New Item
          </button>
        </section>

        {/* ── Footer ── */}
        <div className="drawer-footer">
          {editInvoice ? (
            <>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSavePending}>Save Changes</button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={onClose}
                style={{ marginRight: 'auto' }}
              >
                Discard
              </button>
              <button className="btn btn-dark" onClick={handleSaveDraft}>Save as Draft</button>
              <button className="btn btn-primary" onClick={handleSavePending}>Save &amp; Send</button>
            </>
          )}
        </div>
      </aside>

    </div>
  );
}

export default InvoiceForm;
