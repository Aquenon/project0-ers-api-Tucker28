import express from 'express';
import * as UserDao from '../dao/user.dao';
import { authMiddleware } from '../middleware/auth.middleware';
export const userRouter = express.Router();

// /users - find all
userRouter.get('', [authMiddleware, async (req: express.Request, res: express.Response) => {
      // res.json(users);
      try {
        const users = await UserDao.findAll();
        res.json(users);
      } catch (err) {
        res.sendStatus(500);
      }
    }]);
  
  // /users/:id - find by id
  userRouter.get('/:id', async (req, res) => {
    console.log(req.params);
    const idParam = +req.params.id;
    // +'1' - will convert to number
    // const user = users.find(ele => ele.id === idParam);
    try {
      const user = await UserDao.findById(idParam);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
  
  userRouter.post('', async (req, res) => {
    // users.push(req.body);
    try {
      const user = await UserDao.save(req.body);
      res.status(201);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

userRouter.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!")
})

userRouter.get('', function (req, res) {
    res.send('Got a GET request at /user')
})

userRouter.get('/:id', function (req, res) {
    res.send('Got a GET request at /user for a specific user')
})

userRouter.post('', function (req, res) {
    res.send('Got a POST request at /user')
})

userRouter.put('', function (req, res) {
    res.send('Got a PUT request at /user')
})

userRouter.patch('', function (req, res) {
    res.send('Got a PATCH request at /user')
})
userRouter.delete('', function (req, res) {
    res.send('Got a DELETE request at /user')
})