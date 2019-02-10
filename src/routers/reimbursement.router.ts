import express from 'express';
import * as ReimbursementDao from '../dao/reimbursement.dao';
import { auth$Mgr, authRole } from '../middleware/auth.middleware';
import { createSocket } from 'dgram';

export const reimbursementRouter = express.Router();

// /reimbursement/status/:id - find $ by statusID
reimbursementRouter.get('/status/:id', [auth$Mgr, async (req: express.Request, res: express.Response) => {
      console.log('Reimbursement by statusID function from reimbursementRouter');
      console.log(req.session.user);
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const idParam = req.params.id.toString();
      try {
        const reimbursement = await ReimbursementDao.find$ByStatusID(idParam);
        res.json(reimbursement);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    }]);

// /reimbursement/author/user/:username - find $ by userID (Author)
reimbursementRouter.get('/author/user/:username', async (req: express.Request, res: express.Response) => {
  console.log('Reimbursement by userID function from reimbursementRouter');
  const user = req.session.user.username;
  const role = req.session.user.role;
  const idParam = req.params.username.toString();
  if (user === idParam || role === 'financeManager') {
    console.log('condition true');
    try {
      const reimbursement = await ReimbursementDao.find$ByUserID(idParam);
      res.json(reimbursement);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
      console.log('condition false');
      res.status(401).json({ message: 'User unauthorized for this procedure.'});
  }
});

// /reimbursements - submit new reimbursement
reimbursementRouter.post('', async (req: express.Request, res: express.Response) => {
  try {
      const rUser = req.session.user.username;
      const reimbursement = await ReimbursementDao.submitReimbursement(req.body, rUser);
      res.status(201).json(reimbursement);
  } catch (err) {
      console.log(err);
      res.sendStatus(500);
  }
});

// /reimbursements - update reimbursement
reimbursementRouter.patch('', [auth$Mgr, async (req: express.Request, res: express.Response) => {
    try {
        const rUser = req.session.user.username;
        const reimbursement = await ReimbursementDao.updateReimbursement(req.body, rUser);
        res.json(reimbursement);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}]);