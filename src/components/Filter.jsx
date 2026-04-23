import { useState, useRef, useEffect } from 'react';
import './Filter.css';

const STATUSES = ['draft', 'pending', 'paid', 'all'];

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path
      d="M1 4l2.5 2.5L9 1"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronIcon = ({ open }) => (
  <svg
    width="11"
    height="7"
    viewBox="0 0 11 7"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
  >
    <path
      d="M1 1l4.228 4.228L9.456 1"
      stroke="#7C5DFA"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Status filter dropdown with checkbox options.
 * Manages its own open/close state; notifies parent via setFilter.
 */
function Filter({ filter, setFilter }) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggle = (status) =>
    setFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );

  return (
    <div ref={ref} className="filter-wrapper">
      <button
        className={`filter-toggle${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="label-full">Filter by status</span>
        <span className="label-short">Filter</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="filter-dropdown" role="listbox">
         
          {STATUSES.map((status) => {
            const checked = filter.includes(status) || filter.includes('all');
            return (
              <div
                key={status}
                className="filter-option"
                role="option"
                aria-selected={checked}
                onClick={() => toggle(status)}
              >
                <div
                  className="filter-checkbox"
                  style={{
                    background: checked ? '#7C5DFA' : 'transparent',
                    border: `1px solid ${checked ? '#7C5DFA' : '#DFE3FA'}`,
                  }}

                >
                  {checked && <CheckIcon />}
                </div>
                <span className="filter-option-label">{status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Filter;
