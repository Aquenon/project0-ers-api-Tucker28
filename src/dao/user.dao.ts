import { User } from '../models/user';
import { connectionPool } from '../utility/connections';

/**
 * Find all users
 */
export async function findAll(): Promise<User[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
    `SELECT u.user_id, u.username, u.passwrd,u.first_name, u.last_name, u.email,
      r.role FROM users u JOIN roles r ON u.role = r.role_id`
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

/**
 * Find user by ID
 * @param id 
 */
export async function findById(id: number): Promise<User> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      `SELECT u.user_id, u.username, u.passwrd, u.first_name, u.last_name,
	    u.email, r.role FROM users u JOIN roles r on u.role = r.role_id
      WHERE u.user_id = $1;`,
      [id]
    );
    const sqlUser = result.rows[0];
    if (sqlUser) {
      return {
        userId: sqlUser['user_id'],
        username: sqlUser.username,
        password: '', // Redacted for security
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
 * Add new user
 * @param user 
 */
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

/**
 * Update user, Username needed, all other fields optional
 * Ugly code.  Need refactoring.
 * @param user 
 */
export async function updateUser(user: User): Promise<User> {
  const client = await connectionPool.connect();
  let u = "username = '" + user.username;
  if (user.password) {
    let p = "', passwrd = '" + user.password;
    u = u + p;
  }
  if (user.firstName) {
    let f = "', first_name = '" + user.firstName;
    u = u + f;
  }
  if (user.lastName) {
    let l = "', last_name = '" + user.lastName;
    u = u + l;
  }
  if (user.email) {
    let e = "', email = '" + user.email;
    u = u + e;
  }
  if (user.role) {
    let r = "', role = '" + user.role;
    u = u + r;
  }
  try {
    const result = await client.query(
      `UPDATE users SET ${u}' WHERE username = '${user.username}' RETURNING user_id`,
      //[user.username, user.password, user.firstName, user.lastName, user.email, user.role]
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

/**
 * Find user by username
 * @param username
 */
export async function findByUsername(username: string): Promise<User> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
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

/**
 * Passes username and password to database to authenticate.
 * @param username 
 * @param password 
 */
export async function authUser(username: string, password: string): Promise<User> {
  // console.log('authUser function: ' + username);
  // console.log('authUser function: ' + password);
  // console.log([username, password]);
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 and passwrd = $2',
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