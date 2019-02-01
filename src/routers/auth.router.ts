import express from 'express';
import { resolvePtr } from 'dns';

export const authRouter = express.Router();


authRouter.post('/login', (req, res) => {
    if (req.body.username === 'blake' && req.body.password === 'password') {
      const user = {
        username: req.body.username,
        role: 'admin'
      };
      req.session.user = user;
      res.json(user);
    } else if (req.body.username === 'hank' && req.body.password === 'password') {
      const user = {
        username: req.body.username,
        role: 'associate'
      };
      req.session.user = user;
      res.json(user);
    } else {
      res.sendStatus(401);
    }
});
  
  
authRouter.get('/info', (req, res) => {
    res.json(req.session.user);
});