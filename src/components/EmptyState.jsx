import './EmptyState.css';
import emptyImage from '../assets/emptyImage.svg'

/**
 * Displayed when no invoices match the current filter,
 * or when the invoice list is empty.
 */
function EmptyState() {
  return (
    <div className="empty-state" >
      {

        <img src={emptyImage} alt="empty image"></img>


      }

      <div className="empty-state__text">
        <h2 className="empty-state__title">There is nothing here</h2>
        <p className="empty-state__body">
          Create an invoice by clicking the{' '}
          <strong>New Invoice</strong> button and get started.
        </p>
      </div>
    </div>
  );
}

export default EmptyState;
