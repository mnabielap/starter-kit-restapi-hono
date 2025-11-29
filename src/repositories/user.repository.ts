import { User } from '@/services/user.service';

export const findByEmail = async (db: D1Database, email: string): Promise<User | null> => {
  return await db.prepare('SELECT * FROM users WHERE email = ?1').bind(email).first<User>();
};

export const findById = async (db: D1Database, id: number): Promise<Omit<User, 'password'> | null> => {
  return await db.prepare('SELECT id, name, email, role, is_email_verified FROM users WHERE id = ?1').bind(id).first<Omit<User, 'password'>>();
};

export const existsByEmail = async (db: D1Database, email: string, excludeUserId?: number): Promise<boolean> => {
  let query = 'SELECT id FROM users WHERE email = ?1';
  const params: (string | number)[] = [email];
  
  if (excludeUserId) {
    query += ' AND id != ?2';
    params.push(excludeUserId);
  }
  
  const { results } = await db.prepare(query).bind(...params).all();
  return results.length > 0;
};

export const create = async (db: D1Database, user: { name: string; email: string; password?: string; role: string }): Promise<Omit<User, 'password'> | null> => {
  const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?1, ?2, ?3, ?4) RETURNING id, name, email, role, is_email_verified');
  return await stmt.bind(user.name, user.email, user.password, user.role).first<Omit<User, 'password'>>();
};

export const update = async (db: D1Database, userId: number, updates: Partial<User>): Promise<Omit<User, 'password'> | null> => {
  const setClauses = Object.keys(updates).map((key, i) => `${key} = ?${i + 1}`);
  const updateValues = Object.values(updates);
  
  const stmt = db.prepare(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?${updateValues.length + 1} RETURNING id, name, email, role, is_email_verified`);
  return await stmt.bind(...updateValues, userId).first<Omit<User, 'password'>>();
};

export const remove = async (db: D1Database, userId: number): Promise<void> => {
  await db.prepare('DELETE FROM users WHERE id = ?1').bind(userId).run();
};

export const findAll = async (db: D1Database, filter: any, options: any) => {
  const { name, role } = filter;
  const { sortBy, limit = 10, page = 1 } = options;

  let whereClauses = [];
  const queryParams: (string | number)[] = [];

  if (name) {
    whereClauses.push(`name LIKE ?${queryParams.length + 1}`);
    queryParams.push(`%${name}%`);
  }
  if (role) {
    whereClauses.push(`role = ?${queryParams.length + 1}`);
    queryParams.push(role);
  }
  
  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total results count
  const countStmt = db.prepare(`SELECT COUNT(*) as count FROM users ${whereString}`).bind(...queryParams);
  const count = (await countStmt.first<{ count: number }>())?.count ?? 0;

  // Build main query
  const offset = (page - 1) * limit;
  let orderByString = 'ORDER BY created_at DESC';
  if (sortBy) {
    const [key, order] = sortBy.split(':');
    if (key && (order === 'asc' || order === 'desc')) {
      if (['id', 'name', 'email', 'role'].includes(key)) {
        orderByString = `ORDER BY ${key} ${order.toUpperCase()}`;
      }
    }
  }

  const query = `SELECT id, name, email, role, is_email_verified FROM users ${whereString} ${orderByString} LIMIT ?${queryParams.length + 1} OFFSET ?${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  const resultsStmt = db.prepare(query).bind(...queryParams);
  const { results } = await resultsStmt.all<Omit<User, 'password'>>();

  return {
    results,
    totalResults: count
  };
};