import express from 'express';
import { userRouter } from './routers/user.router';
import { authRouter } from './routers/auth.router';
import session from 'express-session';
import bodyParser from 'body-parser';

const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// set up body parser to convert json body to js object and attach to req
app.use(bodyParser.json());

// create logging middleware
app.use((req, res, next) => {
  console.log(`request was made with url: ${req.path}
  and method: ${req.method}`);
  next(); // will pass the request on to search for the next piece of middleware
});

// set up express to attach sessions
const sess = {
  secret: 'potato',
  cookie: { secure: false },
  resave: false,
  saveUnitialized: false
};

// prior to this req.sesssion is nothing
// after this req.session is an object we can store
// any user data we want on
app.use(session(sess));

app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.post('/login', function (req, res) {
    res.send('Log in!')
})

app.post('/', function (req, res) {
    res.send('Got a POST request')
})

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})