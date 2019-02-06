import { connectionPool } from "../utility/connections";
import { Reimbursement } from "../models/reimbursement";

/**
 * Find reimbursements by status
 * @param id
 */
export async function find$ByStatusID(id: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM reimbursement WHERE status = $1 ORDER BY date_submitted',
      [id]
    );
    return result.rows.map(sqlReimbursement => {
      return {
        reimbursementID: sqlReimbursement['reimbursement_id'],
        author: sqlReimbursement.author,
        amount: sqlReimbursement.amount,
        dateSubmitted: sqlReimbursement.date_submitted,
        dateResolved: sqlReimbursement.date_resolved,
        description: sqlReimbursement.description,
        resolver: sqlReimbursement.resolver,
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
export async function find$ByUserID(id: number): Promise<Reimbursement[]> {
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM reimbursement WHERE author = $1 ORDER BY date_submitted',
      [id]
    );
    return result.rows.map(sqlReimbursement => {
      return {
        reimbursementID: sqlReimbursement['reimbursement_id'],
        author: sqlReimbursement.author,
        amount: sqlReimbursement.amount,
        dateSubmitted: sqlReimbursement.date_submitted,
        dateResolved: sqlReimbursement.date_resolved,
        description: sqlReimbursement.description,
        resolver: sqlReimbursement.resolver,
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
export async function submitReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
  console.log(reimbursement);
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      `INSERT INTO reimbursement (author, amount, date_submitted, date_resolved, description,
        resolver, status, type)
        VALUES  ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING reimbursement_id`,
      [reimbursement.author, reimbursement.amount, reimbursement.dateSubmitted,
        reimbursement.dateResolved, reimbursement.description, reimbursement.resolver,
        reimbursement.status, reimbursement.type]
    );
    if (result.rows[0]) {
      const id = result.rows[0].user_id;
      return {
        ...reimbursement,
        reimbursementID: id
      };
    } else {
      return undefined;
    }
  } finally {
    client.release(); // release connection
  }
}

/**
 * Update reimbursement.  Currently not working.
 * @param reimbursement 
 */
export async function updateReimbursement(reimbursement: Reimbursement): Promise<Reimbursement> {
  console.log(reimbursement);
  const client = await connectionPool.connect();
  try {
    const result = await client.query(
      `UPDATE reimbursement
        SET (author, amount, date_submitted, date_resolved, description,
        resolver, status, type)
        VALUES  ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING reimbursement_id`,
      [reimbursement.author, reimbursement.amount, reimbursement.dateSubmitted,
        reimbursement.dateResolved, reimbursement.description, reimbursement.resolver,
        reimbursement.status, reimbursement.type]
    );
    if (result.rows[0]) {
      const id = result.rows[0].reimbursement_id;
      return {
        ...reimbursement,
        reimbursementID: id
      };
    } else {
      return undefined;
    }
  } finally {
    client.release(); // release connection
  }
}