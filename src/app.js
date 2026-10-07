require('dotenv').config();
const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const { writeConnection, DB_NAME } = require('./config/database');
const bookRoutes = require('./routes/bookRoutes');
const studentConfig = require('./utils/studentConfig');

process.on('unhandledRejection', (reason) => {
  console.warn('Unhandled Rejection:', reason && reason.message ? reason.message : reason);
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    helpers: {
      eq: (a, b) => a === b,
      formatNumber: (n) => Number(n).toLocaleString('vi-VN'),
    },
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

const sessionSecret = process.env.SESSION_SECRET || 'default_secret';

const clientPromise = writeConnection.asPromise().then((conn) => conn.getClient());

const store = MongoStore.create({
  clientPromise,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60,
  autoRemove: 'native',
});

store.on('error', (err) => {
  console.warn('Session store error:', err.message);
});

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      secure: false,
    },
  })
);

app.use((req, res, next) => {
  res.locals.student = studentConfig;
  next();
});

app.use('/', bookRoutes);

app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Not Found',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Student: ${studentConfig.hoVaTen} - ${studentConfig.mssv}`);
  console.log(`Database: ${DB_NAME}`);
  console.log(`Required prefix: ${studentConfig.requiredPrefix}`);
  console.log(`VAT rate: ${studentConfig.vatRate}%`);
});

module.exports = app;
