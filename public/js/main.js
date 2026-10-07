document.addEventListener('DOMContentLoaded', () => {
  const bookCodeInput = document.getElementById('bookCode');
  const originalPriceInput = document.getElementById('originalPrice');
  const previewFinalPrice = document.getElementById('previewFinalPrice');
  const prefixCheckText = document.getElementById('prefixCheckText');
  const addBookForm = document.getElementById('addBookForm');

  const requiredPrefix = '010';
  const vatRate = 4;

  if (originalPriceInput && previewFinalPrice) {
    originalPriceInput.addEventListener('input', () => {
      const price = parseFloat(originalPriceInput.value) || 0;
      if (price <= 0) {
        previewFinalPrice.textContent = '0 VNĐ';
        return;
      }
      const finalPrice = price * (1 + vatRate / 100);
      previewFinalPrice.textContent = Math.round(finalPrice).toLocaleString('vi-VN') + ' VNĐ';
    });
  }

  if (bookCodeInput && prefixCheckText) {
    const validateCode = () => {
      const val = bookCodeInput.value.trim();
      if (!val) {
        prefixCheckText.textContent = '';
        return;
      }
      if (val.startsWith(requiredPrefix)) {
        prefixCheckText.textContent = ' (Hợp lệ)';
        prefixCheckText.style.color = 'green';
      } else {
        prefixCheckText.textContent = ' (Phải bắt đầu bằng ' + requiredPrefix + ')';
        prefixCheckText.style.color = 'red';
      }
    };
    bookCodeInput.addEventListener('input', validateCode);
    validateCode();
  }

  if (addBookForm && bookCodeInput) {
    addBookForm.addEventListener('submit', (e) => {
      const val = bookCodeInput.value.trim();
      if (!val.startsWith(requiredPrefix)) {
        e.preventDefault();
        alert('Mã sản phẩm bắt buộc phải có tiền tố là ' + requiredPrefix);
        bookCodeInput.focus();
      }
    });
  }
});
