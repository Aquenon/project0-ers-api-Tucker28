import express from 'express';
import { rootDir } from '..';
import * as UserDao from '../dao/user.dao';
import { authMiddleware } from '../middleware/auth.middleware';
//import { resolvePtr } from 'dns';

export const authRouter = express.Router();

authRouter.post('/signin', (req, res) => {
    if (req.body.username === 'blake' && req.body.password === 'password') {
      console.log('entered function: blake');
      const user = {
        username: req.body.username,
        role: 'admin'
      };
      req.session.user = user;
      res.json(user);
    } else if (req.body.username === 'hank' && req.body.password === 'password') {
      console.log('entered function: hank');
      const user = {
        username: req.body.username,
        role: 'associate'
      };
      req.session.user = user;
      res.json(user);
    } else {
      console.log('entered function: no user');
      console.log(`${req.body.username} and ${req.body.password}`);
      console.log(req.body);
      res.sendFile(`${rootDir}/public/signin.html`);
      res.sendStatus(401);
    }
});

authRouter.use('', [authMiddleware, (req: express.Request, res: express.Response) => {
  console.log(`User was logged in and didn't redirect to the signin page`);
  res.sendStatus(201);
}]);

authRouter.get('/info', (req, res) => {
    res.json(req.session.user);
});

authRouter.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})