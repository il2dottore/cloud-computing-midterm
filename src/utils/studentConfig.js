require('dotenv').config();

function getStudentConfig() {
  const hoVaTen = process.env.HO_VA_TEN ? process.env.HO_VA_TEN.replace(/['"]/g, '') : 'Vo Ngoc Bao';
  const mssv = process.env.MA_SV ? process.env.MA_SV.replace(/['"]/g, '') : '23ITB010';

  const digitsOnly = mssv.replace(/\D/g, '');
  const lastThreeDigits = digitsOnly.length >= 3 ? digitsOnly.slice(-3) : '010';
  const lastDigit = digitsOnly.length > 0 ? parseInt(digitsOnly.slice(-1), 10) : 0;
  const vatRate = lastDigit + 4;

  return {
    hoVaTen,
    mssv,
    requiredPrefix: lastThreeDigits,
    lastDigit,
    vatRate,
    calculatePriceWithVAT: (originalPrice) => {
      const price = Number(originalPrice);
      if (isNaN(price) || price < 0) return 0;
      const finalPrice = price * (1 + vatRate / 100);
      return Math.round(finalPrice * 100) / 100;
    },
    validateBookCode: (bookCode) => {
      if (!bookCode || typeof bookCode !== 'string') return false;
      return bookCode.trim().startsWith(lastThreeDigits);
    }
  };
}

module.exports = getStudentConfig();
