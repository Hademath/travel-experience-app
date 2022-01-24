import createError, { HttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
const passport = require('passport');
const exphbs = require('express-handlebars');
import { connect, mongoose } from './config/db';
import dotenv from 'dotenv';
import morgan from 'morgan';
const methodOverride = require('method-override');
const session = require('express-session');
const app = express();
import indexRouter from './routes/index';
import authRoute from './routes/auth';
import travelRoute from './routes/travels';
const MongoStore = require('connect-mongo')(session);

dotenv.config({ path: './config.env' });

require('./config/passport')(passport);

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/../views'));



app.use(
  cors({
    origin: [
      'http://localhost:4000/',
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require('./helpers/hbs');

// Handlebars
app.engine(
  '.hbs',
  exphbs.engine({
    helpers: {
      editIcon,
      formatDate,
      stripTags,
      truncate,
      select,
    },
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '/../views/layouts'),
  })
);
app.set('view engine', 'hbs');

// sesssion middleware
// Method override

//passport middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));

app.use(
  methodOverride(function (req: Request, res: Response) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: false,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(function (req: any, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRoute);
app.use('/travels', travelRoute);

app.use(logger('dev'));
app.use(morgan('dev'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

const PORT = process.env.PORT || 4000;
connect();
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
