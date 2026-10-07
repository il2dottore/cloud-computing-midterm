const bookService = require('../services/bookService');
const studentConfig = require('../utils/studentConfig');

class BookController {
  async getHomePage(req, res) {
    try {
      req.session.views = (req.session.views || 0) + 1;
      req.session.lastActive = new Date().toLocaleString('vi-VN');

      const flash = req.session.flash || null;
      req.session.flash = null;

      const books = await bookService.getAllBooks();

      const formattedBooks = books.map(book => ({
        ...book,
        formattedOriginalPrice: Number(book.originalPrice).toLocaleString('vi-VN') + ' đ',
        formattedFinalPrice: Number(book.finalPrice).toLocaleString('vi-VN') + ' đ',
        formattedDate: new Date(book.createdAt).toLocaleString('vi-VN')
      }));

      res.render('index', {
        title: 'Quản Lý Sách',
        books: formattedBooks,
        student: studentConfig,
        sessionInfo: {
          sessionId: req.sessionID,
          views: req.session.views,
          lastActive: req.session.lastActive
        },
        flash
      });
    } catch (error) {
      console.error('Lỗi khi tải trang chủ:', error);
      res.render('index', {
        title: 'Quản Lý Sách',
        books: [],
        student: studentConfig,
        sessionInfo: {
          sessionId: req.sessionID,
          views: req.session.views || 1,
          lastActive: new Date().toLocaleString('vi-VN')
        },
        flash: {
          type: 'danger',
          message: `Lỗi kết nối cơ sở dữ liệu: ${error.message}`
        }
      });
    }
  }

  async createBook(req, res) {
    try {
      const { bookCode, title, author, category, originalPrice, description } = req.body;

      if (!studentConfig.validateBookCode(bookCode)) {
        req.session.flash = {
          type: 'danger',
          message: `Mã sách "${bookCode}" không hợp lệ. Mã sản phẩm bắt buộc phải có tiền tố là ${studentConfig.requiredPrefix}.`
        };
        return res.redirect('/');
      }

      if (!title || !author || !originalPrice) {
        req.session.flash = {
          type: 'warning',
          message: 'Vui lòng nhập đầy đủ các trường thông tin bắt buộc.'
        };
        return res.redirect('/');
      }

      const numPrice = parseFloat(originalPrice);
      if (isNaN(numPrice) || numPrice < 0) {
        req.session.flash = {
          type: 'warning',
          message: 'Giá gốc sách phải là số lớn hơn hoặc bằng 0.'
        };
        return res.redirect('/');
      }

      const vatPercent = studentConfig.vatRate;
      const finalPrice = studentConfig.calculatePriceWithVAT(numPrice);

      await bookService.createBook({
        bookCode: bookCode.trim(),
        title: title.trim(),
        author: author.trim(),
        category: category ? category.trim() : 'Chung',
        originalPrice: numPrice,
        vatPercent,
        finalPrice,
        description: description ? description.trim() : ''
      });

      req.session.flash = {
        type: 'success',
        message: `Thêm sách "${title}" thành công qua luồng WRITE. Giá gốc: ${numPrice.toLocaleString('vi-VN')} đ, VAT (${vatPercent}%): ${(finalPrice - numPrice).toLocaleString('vi-VN')} đ, Giá sau thuế: ${finalPrice.toLocaleString('vi-VN')} đ.`
      };
      res.redirect('/');
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error);
      let errorMsg = `Lỗi hệ thống: ${error.message}`;
      if (error.code === 11000) {
        errorMsg = `Mã sách "${req.body.bookCode}" đã tồn tại trong cơ sở dữ liệu.`;
      }
      req.session.flash = {
        type: 'danger',
        message: errorMsg
      };
      res.redirect('/');
    }
  }

  async testLeastPrivilege(req, res) {
    try {
      const dummyCode = `${studentConfig.requiredPrefix}-TEST-${Date.now().toString().slice(-4)}`;
      await bookService.simulateUnauthorizedWrite({
        bookCode: dummyCode,
        title: 'Sách kiểm thử',
        author: 'Tester',
        originalPrice: 100000,
        vatPercent: studentConfig.vatRate,
        finalPrice: 104000
      });

      req.session.flash = {
        type: 'warning',
        message: 'Tài khoản READ đã thực thi ghi thành công (Vui lòng kiểm tra lại quyền trên Atlas nếu cần giới hạn read-only).'
      };
    } catch (error) {
      req.session.flash = {
        type: 'info',
        message: `Cơ chế bảo mật đã chặn thao tác ghi từ tài khoản đọc: ${error.message}`
      };
    }
    res.redirect('/');
  }
}

module.exports = new BookController();
