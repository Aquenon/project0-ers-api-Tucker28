import express from 'express';
import { rootDir } from "..";

/**
 * Middleware to ensure admin privileges.
 * @param req 
 * @param res 
 * @param next 
 */
export function authAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.session.user;
  console.log('authAdmin Middleware activated');
  if (!user) {
    res.status(401).json({ message: 'The incoming token has expired'});
  } else if (user && user.role === 'admin') {
    next();
  } else if (user.role) {
      res.status(401).json({ message: 'User unauthorized for this procedure.'});
  } else {
    //res.sendFile(`${rootDir}/public/signin.html`);
    res.status(401).json({ message: 'The incoming token has expired'});
  }
}

/**
 * Middleware to ensure Finance Manager privileges.
 * @param req 
 * @param res 
 * @param next 
 */
export function auth$Mgr(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.session.user;
  console.log('auth$MgrMiddleware activated');
  if (!user) {
    res.status(401).json({ message: 'The incoming token has expired'});
  } else if (user && user.role === 'financeManager') {
    next();
  } else if (user.role) {
    res.status(401).json({ message: 'User unauthorized for this procedure.'});
  } else {
    res.status(401).json({ message: 'The incoming token has expired'});
  }
}

/**
 * Middleware to ensure user has an actual role.
 * @param req 
 * @param res 
 * @param next 
 */
export function authRole(req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = req.session.user;
  console.log('authRole Middleware activated');
  if (user) {
    next();
  } else {
    res.status(401).json({ message: 'The incoming token has expired'});
  }
}