import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  host: 'frp-ask.com',
  port: 28790,
  database: 'postgres',
  user: 'postgres',
  password: '12345678',
  ssl: false
});

export async function createUser(
  username: string,
  password: string,
  email?: string,
  gender?: string,
  fullname?: string,
  travelPreferences?: string,
  itemLike?: string
) {
  const client = await pool.connect();
  try {
    // Generate a random protype_id
    const protype_id = Array(25)
        .fill(null)
        .map(() => Math.random().toString(36).charAt(2))
        .join('');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
        `INSERT INTO users (protype_id, username, password, email, gender, fullname, travel_preferences, item_like)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, username, email, gender, fullname, travelPreferences, item_like`,
        [protype_id, username, hashedPassword, email, gender, fullname, travelPreferences, itemLike]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export async function loginUser(username: string, password: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return null;
    }

    // Don't send the password back to the client
    delete user.password;
    return user;
  } finally {
    client.release();
  }
}

export async function updateUser(
  userId?: number,
  username?: string,
  email?: string,
  gender?: string,
  fullname?: string,
  travelPreferences?: string,
  itemLike?: string
) {
  const client = await pool.connect();
  try {
    const result = await client.query(
        `UPDATE users
         SET email              = COALESCE($2, email),
             gender             = COALESCE($3, gender),
             fullname           = COALESCE($4, fullname),
             travel_preferences = COALESCE($5, travel_preferences),
             item_like          = COALESCE($6, itemLike)
         WHERE id = $1 RETURNING id, username, email, gender, fullname, travelPreferences, itemLike`,
        [userId, username, email, gender, fullname, travelPreferences, itemLike]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}