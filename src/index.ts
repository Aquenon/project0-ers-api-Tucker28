import express from 'express';
import { userRouter } from './routers/user.router';
import { authRouter } from './routers/auth.router';
import session from 'express-session';
import bodyParser from 'body-parser';
import { reimbursementRouter } from './routers/reimbursement.router';
import { authMiddleware } from './middleware/auth.middleware';

const app = express();
const port = 3000;
export const rootDir = __dirname;

app.listen(port, () => console.log(`ERS App listening on port ${port}!`))


// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());

// create logging middleware
app.use((req, res, next) => {
  console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
  console.log(req.body);
  next(); // will pass the request on to search for the next piece of middleware
});

// set up express to attach sessions
const sess = {
  secret: 'sith',
  cookie: { secure: false },
  resave: false,
  saveUnitialized: false
};

app.use(express.static(`${rootDir}/public`));

// prior to this req.sesssion is nothing
// after this req.session is an object we can store
// any user data we want on
app.use(session(sess));

app.use('/users', userRouter);
app.use('/reimbursement', reimbursementRouter);
app.use('/', authRouter);

// app.get('/', function (req, res) {
//    res.send('Hello World!')
// })

// app.get('/signin', function (req, res) {
//     res.sendFile(`${rootDir}/public/signin.html`);
// })

// app.get('/', function (req, res) {
//     res.send('Got a GET test request')
// })

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})