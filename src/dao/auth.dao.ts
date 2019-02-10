import express from 'express';
import { User } from '../models/user';
import { connectionPool } from '../utility/connections';

/**
 * Passes username and password to database to authenticate.
 * @param username 
 * @param password 
 */
export async function authUser(username: string, password: string): Promise<User> {
    const client = await connectionPool.connect();
    try {
      const result = await client.query(
        `SELECT user_id, username, first_name, last_name, email, role
        FROM users WHERE username = $1 and passwrd = $2`,
        [username, password]
      );
      const sqlUser = result.rows[0]; // only 1 record in the DB, unique field
      console.log('authUser function DB results:');
      //console.log(sqlUser);
      if (sqlUser) {
        return {
          userId: sqlUser['user_id'],
          username: sqlUser.username,
          password: '', // don't send back the passwords
          firstName: sqlUser.first_name,
          lastName: sqlUser.last_name,
          email: sqlUser.email,
          role: sqlUser.role
        };
      } else {
        return undefined;
      }
    } finally {
      client.release(); // release connection
    }
  }

/**
 * Middleware to ensure user has an actual role.
 * @param req 
 * @param res 
 * @param next 
 */
export async function authPersonal(req: express.Request, res: express.Response, next: express.NextFunction) {
    const user = req.session.user.username;
    const client = await connectionPool.connect();
    try {
      const result = await client.query(
        `SELECT user_id, username FROM users WHERE username = '${user}';`
      );
      const sqlUser = result.rows[0]; // only 1 record in the DB, unique field
      if (sqlUser) {
        return {
          userId: sqlUser['user_id'],
          username: sqlUser.username,
          password: '',
          firstName: sqlUser.first_name,
          lastName: sqlUser.last_name,
          email: sqlUser.email,
          role: sqlUser.role
        };
      } else {
        return undefined;
      }
    } finally {
      client.release(); // release connection
    }
  }