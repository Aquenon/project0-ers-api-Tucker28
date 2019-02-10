import { connectionPool } from "../utility/connections";
import { Reimbursement } from "../models/reimbursement";

/**
 * Find reimbursements by status
 * @param id
 */
export async function find$ByStatusID(id: string): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    console.log('this is the parameter passed: ' + id);
    const result = await client.query(
      'SELECT * FROM view_reimbursement WHERE status = $1 ORDER BY date_submitted',
      [id]
    );
    return result.rows.map(sqlReimbursement => {
      return {
        reimbursementID: sqlReimbursement['reimbursement_id'],
        author: sqlReimbursement.author_name,
        amount: sqlReimbursement.amount,
        dateSubmitted: sqlReimbursement.date_submitted,
        dateResolved: sqlReimbursement.date_resolved,
        description: sqlReimbursement.description,
        resolver: sqlReimbursement.resolver_name,
        status: sqlReimbursement.status,
        type: sqlReimbursement.type
      };
    });
  } finally {
    client.release(); // release connection
  }
}

/**
 * Find reimbursements by author
 * @param id 
 */
export async function find$ByUserID(id: string): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM view_reimbursement WHERE author = $1 ORDER BY date_submitted',
      [id]
    );
    return result.rows.map(sqlReimbursement => {
      return {
        reimbursementID: sqlReimbursement['reimbursement_id'],
        author: sqlReimbursement.author_name,
        amount: sqlReimbursement.amount,
        dateSubmitted: sqlReimbursement.date_submitted,
        dateResolved: sqlReimbursement.date_resolved,
        description: sqlReimbursement.description,
        resolver: sqlReimbursement.resolver_name,
        status: sqlReimbursement.status,
        type: sqlReimbursement.type
      };
    });
  } finally {
    client.release(); // release connection
  }
}

/**
 * Find reimbursements by author
 * @param id 
 */
export async function find$ByUsername(id: string): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM view_reimbursement WHERE author_name = $1 ORDER BY date_submitted',
      [id]
    );
    return result.rows.map(sqlReimbursement => {
      return {
        reimbursementID: sqlReimbursement['reimbursement_id'],
        author: sqlReimbursement.author_name,
        amount: sqlReimbursement.amount,
        dateSubmitted: sqlReimbursement.date_submitted,
        dateResolved: sqlReimbursement.date_resolved,
        description: sqlReimbursement.description,
        resolver: sqlReimbursement.resolver_name,
        status: sqlReimbursement.status,
        type: sqlReimbursement.type
      };
    });
  } finally {
    client.release(); // release connection
  }
}

/**
 * Submit reimbursements. All users can use this function,
 * @param reimbursement 
 */
export async function submitReimbursement(reimbursement: Reimbursement, rUser: string): Promise<Reimbursement> {
  console.log(reimbursement);
  const client = await connectionPool.connect();
  let today = new Date();
  let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  try {
    let rUserID = await client.query (
      `SELECT user_id FROM users WHERE username = $1;`,
      [rUser]
    );
    rUserID = rUserID.rows[0].user_id;
    let rTypeID = await client.query(
      `SELECT type_id FROM reimbursement_type WHERE type = $1;`,
      [reimbursement.type]
    );
    rTypeID = rTypeID.rows[0].type_id;
    const submit = await client.query(
      `INSERT INTO reimbursement (author, amount, date_submitted, description, status, type)
        VALUES  ($1, $2, $3, $4, $5, $6)
        RETURNING reimbursement_id, date_resolved, status;`,
      [rUserID, reimbursement.amount, date, reimbursement.description, 1, rTypeID]
    );
    const id = submit.rows[0].reimbursement_id;
    const result = await client.query(
      `SELECT * FROM view_reimbursement WHERE reimbursement_id = $1;`,
      [id]
    );
    if (result.rows[0]) {
      const record = result.rows[0];
      return {
        reimbursementID: id,
        author: record.author_name,
        amount: record.amount,
        dateSubmitted: record.date_submitted,
        dateResolved: record.date_resolved,
        description: record.description,
        resolver: record.resolver_name,
        status: record.status,
        type: record.type
      };
    } else {
      return undefined;
    }
  } finally {
    client.release(); // release connection
  }
}

/**
 * Update reimbursement
 * @param reimbursement 
 */
export async function updateReimbursement(reimbursement: Reimbursement, rUser: string): Promise<Reimbursement> {
    console.log(reimbursement);
    const client = await connectionPool.connect();
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    console.log(date);
    try {
      console.log('attempting rUserID query');
      let rUserID = await client.query(
        `SELECT user_id FROM users WHERE username = $1`,
        [rUser]
      );
      rUserID = rUserID.rows[0].user_id;
      console.log('attempting rStatus query');
      let rStatusID = await client.query(
        `SELECT status_id FROM reimbursement_status WHERE status = $1`,
        [reimbursement.status]
      );
      rStatusID = rStatusID.rows[0].status_id;
      console.log('attempting update query');
      const update = await client.query(
        `UPDATE reimbursement
        SET date_resolved = $1, resolver = $2, status = $3
        WHERE reimbursement_id = $4;`,
        [date, rUserID, rStatusID, reimbursement.reimbursementID]
      );
      console.log('attempting result query');
      console.log(reimbursement.reimbursementID);
      const result = await client.query(
        `SELECT * FROM view_reimbursement WHERE reimbursement_id = $1;`,
        [reimbursement.reimbursementID]
      );
      console.log('attempting return');
    if (result.rows[0]) {
      const record = result.rows[0];
      return {
        reimbursementID: record.reimbursement_id,
        author: record.author_name,
        amount: record.amount,
        dateSubmitted: record.date_submitted,
        dateResolved: record.date_resolved,
        description: record.description,
        resolver: record.resolver_name,
        status: record.status,
        type: record.type
      }
    } else {
      return undefined;
    }
  } finally {
    client.release(); // release connection
  }
}
