export interface Token {
  id: number;
  token: string;
  user_id: number;
  type: string;
  expires: string;
  blacklisted: number;
}

export const create = async (db: D1Database, tokenData: { token: string; user_id: number; type: string; expires: string }): Promise<void> => {
  await db.prepare('INSERT INTO tokens (token, user_id, type, expires) VALUES (?1, ?2, ?3, ?4)')
          .bind(tokenData.token, tokenData.user_id, tokenData.type, tokenData.expires).run();
};

export const findOne = async (db: D1Database, token: string, type: string, blacklisted = 0): Promise<Token | null> => {
  return await db.prepare('SELECT * FROM tokens WHERE token = ?1 AND type = ?2 AND blacklisted = ?3')
                 .bind(token, type, blacklisted)
                 .first<Token>();
};

export const deleteById = async (db: D1Database, id: number): Promise<void> => {
  await db.prepare('DELETE FROM tokens WHERE id = ?1').bind(id).run();
};

export const deleteByToken = async (db: D1Database, token: string): Promise<void> => {
  await db.prepare('DELETE FROM tokens WHERE token = ?1').bind(token).run();
};

export const deleteByUserAndType = async (db: D1Database, userId: number, type: string): Promise<void> => {
  await db.prepare('DELETE FROM tokens WHERE user_id = ?1 AND type = ?2')
          .bind(userId, type)
          .run();
};