import { User } from '../models/user';
import { connectionPool } from '../utility/connections';

/**
 * Find all users
 */
export async function findAll(): Promise<User[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
    `SELECT u.user_id, u.username, u.first_name, u.last_name, u.email, r.role
    FROM users u JOIN roles r ON u.role = r.role_id ORDER BY u.user_id;`
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
      `SELECT u.user_id, u.username, u.first_name, u.last_name, u.email, r.role
      FROM users u JOIN roles r ON u.role = r.role_id WHERE u.user_id = $1;`,
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
 * @param user 
 */
export async function updateUser(user: User): Promise<User> {
  const client = await connectionPool.connect();

  try {
    console.log('Trying userInfo query');
    const userInfo = await client.query(
      `SELECT * FROM users WHERE username = $1;`,
      [user.username]
    );

    if (userInfo.rows[0]) {
      user.userId = userInfo.rows[0].user_id;
    }

    if (user.password) {userInfo.rows[0].passwrd = user.password;}
    if (user.firstName) {userInfo.rows[0].first_name = user.firstName;}
    if (user.lastName) {userInfo.rows[0].last_name = user.lastName;}
    if (user.email) {userInfo.rows[0].email = user.email;}
    if (user.role) {
      console.log('Trying userRole query');
      const userRole = await client.query(
        `SELECT role_id FROM roles WHERE role = $1;`,
        [user.role]
      );
      console.log(userRole);
      console.log(userRole.rows[0].role_id);
      userInfo.rows[0].role = userRole.rows[0].role_id;
    }

    console.log('Trying userUpdate query');
    const userUpdate = await client.query(
      `UPDATE users SET passwrd = $2, first_name = $3, last_name = $4, email = $5, role = $6
      WHERE username = $1;`,
      [userInfo.rows[0].username, userInfo.rows[0].passwrd, userInfo.rows[0].first_name,
      userInfo.rows[0].last_name, userInfo.rows[0].email, userInfo.rows[0].role]
    );

    console.log('Trying result query');
    const result = await client.query(
      `SELECT u.user_id, u.username, u.first_name, u.last_name, u.email, r.role
      FROM users u JOIN roles r ON r.role_id = u.role WHERE u.user_id = $1;`,
      [user.userId]
    );
    if (result.rows[0]) {
      const record = result.rows[0];
      return {
        userId: record.user_id,
        username: record.username,
        password: '***************',
        firstName: record.first_name,
        lastName: record.last_name,
        email: record.email,
        role: record.role
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
      `SELECT u.user_id, u.username, u.first_name, u.last_name, u.email, r.role
      FROM users u JOIN roles r ON r.role_id = u.role WHERE u.username = $1;`,
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