import express from 'express';
import { userRouter } from './routers/user.router';
import { authRouter } from './routers/auth.router';
import session from 'express-session';
import bodyParser from 'body-parser';
import { reimbursementRouter } from './routers/reimbursement.router';

const app = express();
const port = 3000;
export const rootDir = __dirname;

app.listen(port, () => console.log(`ERS App listening on port ${port}!`))

// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());

// create logging middleware
app.use((req, res, next) => {
  console.log('\n');
  console.log('\n');
  console.log(`New ${req.method} request starts here:`);
  console.log('------------------------------');
  console.log(`request was made with url: ${req.path} and method: ${req.method}`);
  console.log('req.body:');
  console.log(req.body);
  next();
});

// set up express to attach sessions
const sess = {
  secret: 'sith',
  cookie: { secure: false },
  resave: false,
  saveUnitialized: false
};

// Allows the browser to use all static files in public
// If index.html is sent in a response, client has access
// to any files linked, such as .css
app.use(express.static(`${rootDir}/public`));

// session
app.use(session(sess));

// allow cross origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `${req.headers.origin}`);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/users', userRouter);
app.use('/reimbursement', reimbursementRouter);
app.use('/', authRouter);

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})