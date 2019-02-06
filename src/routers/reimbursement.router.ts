import express from 'express';
import * as ReimbursementDao from '../dao/reimbursement.dao';
import { auth$Mgr, authRole } from '../middleware/auth.middleware';

export const reimbursementRouter = express.Router();

// /reimbursement - by status
// reimbursementRouter.get('', [auth$Mgr, async (req: express.Request, res: express.Response) => {
//     console.log('All reimbursements function from reimbursementRouter');
//     try {
//       const reimbursements = await ReimbursementDao.findByStatusID();
//       res.json(reimbursements);
//     } catch (err) {
//       res.sendStatus(500);
//     }
//   }]);

// /reimbursement/status/:id - find $ by statusID
reimbursementRouter.get('/status/:id', [auth$Mgr, async (req: express.Request, res: express.Response) => {
      console.log('Reimbursement by statusID function from reimbursementRouter');
      console.log(req.params);
      const idParam = +req.params.id;
      console.log(idParam);
      // +'1' - will convert to number
      try {
        const reimbursement = await ReimbursementDao.find$ByStatusID(idParam);
        res.json(reimbursement);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    }]);

// /reimbursement/author/userId/:userId - find $ by userID (Author)
reimbursementRouter.get('/author/user/:id', [auth$Mgr, async (req: express.Request, res: express.Response) => {
    //userRouter.get('/:id', async (req, res) => {
      console.log('Reimbursement by userID function from reimbursementRouter');
      console.log(req.params);
      const idParam = +req.params.id;
      console.log(idParam);
      // +'1' - will convert to number
      try {
        const reimbursement = await ReimbursementDao.find$ByUserID(idParam);
        res.json(reimbursement);
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    }]);

// /reimbursements - submit new reimbursement
reimbursementRouter.post('', [authRole, async (req: express.Request, res: express.Response) => {
  try {
      const reimbursement = await ReimbursementDao.submitReimbursement(req.body);
      res.status(201).json(reimbursement);
  } catch (err) {
      console.log(err);
      res.sendStatus(500);
  }
}]);

// /reimbursements - update reimbursement
reimbursementRouter.patch('', [auth$Mgr, async (req: express.Request, res: express.Response) => {
    try {
        const reimbursement = await ReimbursementDao.updateReimbursement(req.body);
        res.json(reimbursement);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}]);