import express from 'express';
import { rootDir } from '..';
import * as UserDao from '../dao/user.dao';
import { authAdmin } from '../middleware/auth.middleware';

export const authRouter = express.Router();

authRouter.post('/signin', async (req, res) => {
  console.log('Authorization attempt from Single user function using username');
  const potentialUser = req.body.username;
  const password = req.body.password;
  try {
    const checkUser = await UserDao.authUser(potentialUser, password);
    if (checkUser === undefined) {
      //console.log(checkUser);
      res.status(400).json({message: 'Invalid Credentials. Agents are enroute to your location.'});
    }
    const role = +checkUser.role.toString();
    switch (role) {
      case 1:
      case 2:
        const admin = {
          username: req.body.username,
          role: 'admin'
        };
        req.session.user = admin;
        res.json('Authenticated');
        break;
      case 3:
      case 4:
      const moff = {
        username: req.body.username,
        role: 'financeManager'
      };
      req.session.user = moff;
      res.json('Authenticated');
        break;      
      case 5:
      case 6:
      case 7:
      const officer = {
        username: req.body.username,
        role: 'officer'
      };
      req.session.user = officer;
      res.json('Authenticated');
        break;
      case 8:
        res.status(401).json({ message: 'Stormtroopers do not get reimbursements.  Get back to work!'});
        break;
      default:
        console.log('NO ACCESS');
        res.status(400).json({message: 'Invalid Credentials. Agents are enroute to your location.'});
        break;
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

authRouter.use('', [authAdmin, (req: express.Request, res: express.Response) => {
  console.log(`User was logged in and didn't redirect to the signin page`);
  res.sendStatus(201);
}]);

authRouter.get('/info', (req, res) => {
    res.json(req.session.user);
});

authRouter.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})