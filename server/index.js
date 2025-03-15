import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import OpenAI from 'openai';

import crypto from 'crypto'; // 用于生成随机用户名

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  host: 'frp-ask.com',
  port: 28790,
  database: 'cs4474',
  user: 'postgres',
  password: '12345678',
  ssl: false
});

// 你的 ChatGPT API Key
const openai = new OpenAI({
  apiKey: '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'
});

// 如果有邮件需求可保留，否则可去掉
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com',
  port: 465,
  secure: true,
  auth: {
    user: 'yizeyes@163.com',
    pass: 'VHYNwuY28rGvQ4t5'
  }
});

// 简单的输入校验
function validateInput(input = '') {
  return input.replace(/[<>]/g, '').trim();
}

// 生成随机16位用户名
function generateRandomUsername() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

// ============= 1) 用户注册 =============
app.post('/api/signup', async (req, res) => {
  const {username, password, email, gender, fullname, travel_preferences, item_like} = req.body;
  if (!username || !password) {
    return res.status(400).json({error: 'Username and password are required'});
  }

  const client = await pool.connect();
  try {
    // 检查重名
    const existingUser = await client.query('SELECT username FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({error: 'User already exists.'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
        `INSERT INTO users (username, passwd, email, gender, fullname, travel_preferences, item_like)
         VALUES ($1, $2, $3, $4, $5, $6, $7
                ) RETURNING uid, username, email, gender, fullname, travel_preferences, item_like
        `,
        [
          validateInput(username),
          hashedPassword,
          email ? validateInput(email) : null,
          gender ? validateInput(gender) : null,
          fullname ? validateInput(fullname) : null,
          travel_preferences ? validateInput(travel_preferences) : null,
          item_like || null
        ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({error: 'Registration failed'});
  } finally {
    client.release();
  }
});

// ============= 2) 用户登录 =============
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.passwd);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    delete user.passwd;
    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  } finally {
    client.release();
  }
});

// ============= 3) 忘记密码(可选) =============
app.post('/api/forgot-password', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const client = await pool.connect();
  try {
    const result = await client.query(
        'SELECT uid, email FROM users WHERE username = $1',
        [validateInput(username)]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = result.rows[0];
    if (!user.email) {
      return res.status(400).json({ error: 'No email associated with this account' });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await client.query('UPDATE users SET passwd = $1 WHERE uid = $2', [hashedPassword, user.uid]);

    await transporter.sendMail({
      from: 'yizeyes@163.com',
      to: user.email,
      subject: 'Password Recovery',
      text: `Your temporary password is: ${tempPassword}`
    });

    res.json({ message: 'Password recovery email sent' });
  } catch (err) {
    console.error('Password recovery error:', err);
    res.status(500).json({ error: 'Password recovery failed' });
  } finally {
    client.release();
  }
});

// ============= 4) 更新用户资料 =============
// 可用于更新用户的 item_like 等
// 更新用户信息的接口
app.put('/api/users/:uid', async (req, res) => {
  const { email, gender, fullname, travel_preferences, item_like } = req.body;  // 从 req.body 中提取这些字段
  const { uid } = req.params;  // 从 URL 参数中获取 uid
  const parsedUid = parseInt(uid, 10);
  if (isNaN(parsedUid)) {
    return res.status(400).json({error: "Invalid user ID"});
  }
  const client = await pool.connect();
  try {
    const updateFields = [];
    const updateValues = [];

    if (email) {
      updateFields.push("email = $" + (updateFields.length + 1));
      updateValues.push(validateInput(email));
    }
    if (gender) {
      updateFields.push("gender = $" + (updateFields.length + 1));
      updateValues.push(validateInput(gender));
    }
    if (fullname) {
      updateFields.push("fullname = $" + (updateFields.length + 1));
      updateValues.push(validateInput(fullname));
    }
    if (travel_preferences) {
      updateFields.push("travel_preferences = $" + (updateFields.length + 1));
      updateValues.push(validateInput(travel_preferences));
    }
    if (item_like) {
      updateFields.push("item_like = $" + (updateFields.length + 1));
      updateValues.push(validateInput(item_like));
    }

    if (updateFields.length === 0) {
      return res.status(400).json({error: "No valid fields provided for update"});
    }

    updateValues.push(uid);
    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE uid = $${updateValues.length} RETURNING uid, username, email, gender, fullname, travel_preferences, item_like
    `;

    const result = await client.query(query, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({error: "User not found"});
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({error: "Update failed"});
  } finally {
    client.release();
  }
});

// ============= 5) 生成packing_list (英文) 并创建行程 =============
// Enhanced packing list generation using OpenAI GPT API
async function generatePackingListInEnglish(climateData, itemLike) {
  const prompt = `
    You are a travel assistant. The weather conditions for the trip are: "${climateData}".
    The traveler prefers items like: "${itemLike}".

    Generate a concise, bullet-point packing list in English, including essential items based on weather and preferences provided. Avoid additional explanations or text.
  `;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 800
    });

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('Invalid response structure from OpenAI.');
    }

    return response.choices[0].message.content;

  } catch (err) {
    console.error('OpenAI API error:', err);
    return null;  // 明确返回null
  }
}

// API Endpoint for creating packing list and inserting into database
app.post('/api/create-packing-list', async (req, res) => {
  const {username, trip_name, destination, start_date, end_date, women, men, children, climate_data} = req.body;

  if (!username || !trip_name || !destination || !start_date || !end_date) {
    return res.status(400).json({error: 'Missing required fields.'});
  }

  const client = await pool.connect();
  try {
    const userResult = await client.query('SELECT item_like FROM users WHERE uid = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({error: 'User not found.'});
    }

    const itemLike = userResult.rows[0].item_like;
    console.log('Generating packing list with climateData:', climate_data, 'and itemLike:', itemLike);

    // const packingList = await generatePackingListInEnglish(climate_data, itemLike);
    const packingList = "Umbrella";

    if (!packingList) {
      return res.status(500).json({error: 'Failed to generate packing list. Check server logs for details.'});
    }

    const insertResult = await client.query(`
      INSERT INTO trips (username, trip_name, destination, start_date, end_date, women, men, children, climate_data,
                         packing_list, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING *
    `, [
      username, trip_name, destination, start_date, end_date,
      women || 0, men || 0, children || 0, climate_data, packingList
    ]);

    res.json({message: 'Trip created successfully', trip: insertResult.rows[0]});

  } catch (err) {
    console.error('Database error during trip creation:', err);
    res.status(500).json({error: 'Internal server error. Check logs for details.'});
  } finally {
    client.release();
  }
});

// ============= 6) 获取用户 History Trips (以 JSON 返回) =============
app.get('/api/user-history/:username', async (req, res) => {
  const { username } = req.params;
  const client = await pool.connect();
  try {
    const trips = await client.query(
        `SELECT * FROM trips 
       WHERE username = $1
       ORDER BY start_date DESC
      `,
        [username]
    );
    res.json(trips.rows);
  } catch (err) {
    console.error('Query trips error:', err);
    res.status(500).json({ error: 'Failed to retrieve user history' });
  } finally {
    client.release();
  }
});

// ============= 7) 根据用户ID生成并返回 packing list =============
app.get('/api/generate-packing-list/:username', async (req, res) => {
  const { username } = req.params;
  const client = await pool.connect();
  try {
    // 查询用户的item_like偏好
    const userPreferences = await client.query('SELECT item_like FROM users WHERE uid = $1', [username]);
    if (userPreferences.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const itemLike = userPreferences.rows[0].item_like;

    // 假设 climate_data 是已知的或者可以从其他地方获取
    const climateData = {}; // 请根据实际情况填充或修改此处

    // 使用获取的item_like生成 packing list
    const packingList = await generatePackingListInEnglish(climateData, itemLike);
    res.json({ packingList });
  } catch (err) {
    console.error('Error generating packing list:', err);
    res.status(500).json({ error: 'Failed to generate packing list' });
  } finally {
    client.release();
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
