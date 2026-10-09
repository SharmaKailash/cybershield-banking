export function assessRisk({ amount, newBeneficiary, recentTransfers = 0 }) {
  let score = 12;
  const factors = [];
  if (newBeneficiary) {
    score += 22;
    factors.push('New beneficiary');
  }
  if (amount >= 25000) {
    score += 28;
    factors.push('Unusual amount');
  } else if (amount >= 10000) {
    score += 14;
    factors.push('Elevated amount');
  }
  if (recentTransfers >= 2) {
    score += 18;
    factors.push('Multiple rapid transactions');
  }
  const hour = new Date().getHours();
  if (hour < 6 || hour > 22) {
    score += 12;
    factors.push('Unusual transaction time');
  }
  if (factors.length === 0) factors.push('No elevated demo signals');
  score = Math.min(96, score);
  const level = score >= 80 ? 'Critical' : score >= 60 ? 'High' : score >= 35 ? 'Medium' : 'Low';
  return { score, level, factors };
}
