export default function SpendingSection({ amount }: { amount: number }) {
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div className="spending-section">
      <div className="spending-label">Total Spending</div>
      <div className="spending-amount">{formatted}</div>
    </div>
  );
}
