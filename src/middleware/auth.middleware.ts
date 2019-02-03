import express from 'express';
import { rootDir } from "..";

export function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.session.user;
  console.log('auth.middleware activated');
  if (user && user.role === 'admin') {
    next();
  } else {
    res.sendFile(`${rootDir}/public/signin.html`);
  }
}