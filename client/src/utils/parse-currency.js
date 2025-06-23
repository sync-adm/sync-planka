export default function formatBRL(raw) {
  const clean = raw.replace(/[^\d.,]/g, '');

  if (!clean) return 'R$ 0,00';

  if (clean.includes('.') && !clean.includes(',')) {
    const intDigits = clean.replace(/\./g, '') || '0';
    const intFormatted = Number(intDigits)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${intFormatted},00`;
  }

  const digits = clean.replace(/[.,]/g, '');

  const padded = digits.padStart(3, '0');

  const intPart = padded.slice(0, -2) || '0';
  const centsPart = padded.slice(-2);

  const intFormatted = Number(intPart)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${intFormatted},${centsPart}`;
}
