/** Generate a random invoice ID like "RT3080" */
export function uid() {
  const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const N = '0123456789';
  return (
    L[Math.floor(Math.random() * 26)] +
    L[Math.floor(Math.random() * 26)] +
    N[Math.floor(Math.random() * 10)] +
    N[Math.floor(Math.random() * 10)] +
    N[Math.floor(Math.random() * 10)] +
    N[Math.floor(Math.random() * 10)]
  );
}

/** Format an ISO date string to "01 Jan 2021" */
export function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a number as GBP currency */
export function fmtCurrency(n) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(Number(n) || 0);
}

/** Add N days to an ISO date string, return new ISO string */
export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + Number(days));
  return d.toISOString().split('T')[0];
}

/** Sum all item totals */
export function calcTotal(items) {
  return items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
    0
  );
}

/** Today's date as an ISO string */
export function today() {
  return new Date().toISOString().split('T')[0];
}
