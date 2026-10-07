# HUONG DAN NOP BAI THI GIUA KI CLOUD

Sinh vien: Vo Ngoc Bao
MSSV: 23ITB010
De bai: Quan ly sach, bao mat Least Privilege, Stateless Architecture, DevOps.

---

## 1. THONG SO CA NHAN HOA
- Ten Database: DB_23ITB010
- Tien to ma san pham: 010 (3 so cuoi MSSV)
- Thue VAT: VAT = (0 + 4)% = 4%
- Footer Handlebars: Ho ten: Vo Ngoc Bao, MSSV: 23ITB010, VAT: 4%

---

## 2. BƯOC 1: CAU HINH TREN MONGODB ATLAS

### A. Mo quyen truy cap IP (Network Access)
1. Dang nhap MongoDB Atlas (cloud.mongodb.com).
2. Chon Security > Network Access.
3. Bam Add IP Address > Chon Allow Access from Anywhere (0.0.0.0/0) > Bam Confirm.

### B. Tao 02 tai khoan nguoi dung (Least Privilege)
Chon Security > Database Access > Bam Add New Database User:

1. Tai khoan DOC (Read-Only):
   - Username: read_23itb010
   - Password: <mat-khau-cua-ban>
   - Database User Privileges: Built-in Role > Read only any database HOAC gan role read tren database DB_23ITB010.

2. Tai khoan GHI (Write):
   - Username: write_23itb010
   - Password: <mat-khau-cua-ban>
   - Database User Privileges: readWrite tren database DB_23ITB010.

---

## 3. BƯOC 2: KIEM TRA GIT VA DAY LEN GITHUB

Xem lai so do cay merge:
```bash
git log --graph --oneline --all
```

Day code len GitHub:
```bash
git remote add origin https://github.com/<tai-khoan-cua-ban>/cloud-book-management.git
git push -u origin main
git push --all
```

---

## 4. BƯOC 3: TRIEN KHAI LEN RENDER PAAS

1. Dang nhap dashboard.render.com.
2. Tao Web Service moi va chon repository GitHub.
3. Cau hinh:
   - Build Command: npm install
   - Start Command: npm start
4. Cau hinh Environment Variables (Dien truc tiep tren Cloud, khong luu vao code):
   - PORT: 3000
   - NODE_ENV: production
   - HO_VA_TEN: Vo Ngoc Bao
   - MA_SV: 23ITB010
   - DB_NAME: DB_23ITB010
   - SESSION_SECRET: <nhap_chuoi_secret_cua_ban>
   - MONGO_READ_URI: mongodb+srv://read_23itb010:<mat_khau>@cluster0.kdyr5ga.mongodb.net/DB_23ITB010?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true
   - MONGO_WRITE_URI: mongodb+srv://write_23itb010:<mat_khau>@cluster0.kdyr5ga.mongodb.net/DB_23ITB010?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true
5. Bam Create Web Service va cho Render deploy xong.
