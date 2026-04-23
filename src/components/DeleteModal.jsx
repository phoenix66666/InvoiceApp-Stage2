import './DeleteModal.css';

/**
 * Confirmation modal shown before permanently deleting an invoice.
 * Renders over a dimmed overlay; clicking the overlay cancels.
 */
function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  return (
    <div >
      <div
        className="modal-overlay"
        aria-hidden="true"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        onClick={onCancel}
      />
      
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h2 id="delete-modal-title" className="modal__title">
            Confirm Deletion
          </h2>

          <p className="modal__body">
            Are you sure you want to delete invoice{' '}
            <strong>#{invoiceId}</strong>? This action cannot be undone.
          </p>

          <div className="modal__actions">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
    
      
    </div>
  );
}

export default DeleteModal;
