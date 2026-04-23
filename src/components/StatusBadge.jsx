import { useTheme } from '../context/ThemeContext';
import './StatusBadge.css';

/**
 * Displays a coloured pill badge for invoice statuses:
 * "paid" → green, "pending" → orange, "draft" → grey
 */
function StatusBadge({ status }) {
  const { dark } = useTheme();

  const config = {
    paid: {
      background: 'rgba(51, 214, 159, 0.07)',
      color: '#33D69F',
      label: 'Paid',
    },
    pending: {
      background: 'rgba(255, 143, 0, 0.07)',
      color: '#FF8F00',
      label: 'Pending',
    },
    draft: {
      background: dark ? 'rgba(223, 227, 250, 0.07)' : 'rgba(55, 59, 83, 0.07)',
      color:      dark ? '#DFE3FA' : '#373B53',
      label: 'Draft',
    },
  };

  const { background, color, label } = config[status] ?? {
    background: 'transparent',
    color: '#888EB0',
    label: status,
  };

  return (
    <span
      className="status-badge"
      style={{ background, color }}
    >
      <span className="status-badge__dot" style={{ background: color }} />
      {label}
    </span>
  );
}

export default StatusBadge;
