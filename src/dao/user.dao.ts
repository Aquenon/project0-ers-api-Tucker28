import { User } from '../models/user';
import { connectionPool } from '../utility/connections';

export async function findAll(): Promise<User[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users'
    );
    return result.rows.map(sqlUser => {
      return {
        userId: sqlUser['user_id'],
        username: sqlUser.username,
        password: '', // don't send back the passwords
        firstName: sqlUser.first_name,
        lastName: sqlUser.last_name,
        email: sqlUser.email,
        role: sqlUser.role
      };
    });
  } finally {
    client.release(); // release connection
  }
}

export async function findById(id: number): Promise<User> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE user_id = $1',
      [id]
    );
    const sqlUser = result.rows[0]; // there should only be 1 record
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

export async function save(user: User): Promise<User> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (username, passwrd, first_name, last_name, email, role)
        VALUES  ($1, $2, $3, $4, $5, $6)
        RETURNING user_id`,
      [user.username, user.password, user.firstName, user.lastName, user.email, user.role]
    );
    if (result.rows[0]) {
      const id = result.rows[0].user_id;
      return {
        ...user,
        userId: id
      };
    } else {
      return undefined;
    }

  } finally {
    client.release(); // release connection
  }
}