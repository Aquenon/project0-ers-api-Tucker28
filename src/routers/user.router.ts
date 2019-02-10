import express from 'express';
import * as UserDao from '../dao/user.dao';
//import { authPersonal } from '../dao/auth.dao';
import { auth$Mgr, authAdmin } from '../middleware/auth.middleware';
export const userRouter = express.Router();

// /users - find all
userRouter.get('', [auth$Mgr, async (req: express.Request, res: express.Response) => {
  // res.json(users);
  console.log('All users function from userRouter');
  try {
    const users = await UserDao.findAll();
    res.json(users);
  } catch (err) {
    res.sendStatus(500);
  }
}]);

// /users/:id - find by id
userRouter.get('/:id', [auth$Mgr, /**authPersonal(id),*/ async (req: express.Request, res: express.Response) => {
//userRouter.get('/:id', async (req, res) => {
  console.log(req.session.user);
  console.log('Single user function from userRouter');
  console.log(req.params);
  const idParam = +req.params.id;
  console.log(idParam);
  // +'1' - will convert to number
  // const user = users.find(ele => ele.id === idParam);
  try {
    const user = await UserDao.findById(idParam);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}]);

// /users/:username - find by username
// For testing purposes to use for login authorization
userRouter.get('/username/:username', async (req: express.Request, res: express.Response) => {
  // console.log('Single user function from userRouter using username');
  console.log(req.params);
  const user = req.session.user.username;
  const role = req.session.user.role;
  const idParam = req.params.username.toString();
  // console.log(`Session: ${user}`);
  // console.log(`Session: ${role}`);
  // console.log(`Original: ${idParam}`);
  if (user === idParam || role === 'financeManager') {
    console.log('condition true');
    try {
      const user = await UserDao.findByUsername(idParam);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  } else {
    console.log('condition false');
    res.status(401).json({ message: 'User unauthorized for this procedure.'});
  }
  // let userName = idParam.toString();
  // console.log(`Apparantly converted to string: ${userName}`);
  // try {
  //   const user = await UserDao.findByUsername(idParam);
  //   res.json(user);
  //   console.log(user.role);
  //   const role = +user.role.toString();
  //   switch (role) {
  //     case 1:
  //     case 2:
  //       console.log('ADMIN');
  //       break;
  //     case 3:
  //     case 4:
  //     case 5:
  //     case 6:
  //     case 7:
  //       console.log('OFFICER');
  //       break;
  //     case 8:
  //       console.log('TROOPER');
  //       break;
  //     default:
  //       console.log('NO ACCESS');
  //       break;
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.sendStatus(500);
  // }
});
  
// /users - add new user
userRouter.post('', [authAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const user = await UserDao.save(req.body);
    res.status(201);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}]);

// /users - update user
userRouter.patch('', [authAdmin, async (req: express.Request, res: express.Response) => {
  try {
    const user = await UserDao.updateUser(req.body);
    res.status(201);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}]);

userRouter.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})