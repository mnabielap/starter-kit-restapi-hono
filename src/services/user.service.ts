import { ApiError } from '@/utils/ApiError';
import * as bcrypt from 'bcrypt-ts';
import * as userRepository from '@/repositories/user.repository';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  is_email_verified: 0 | 1;
}

/**
 * Check if email is taken by another user
 */
export const isEmailTaken = async (db: D1Database, email: string, excludeUserId?: number): Promise<boolean> => {
  return await userRepository.existsByEmail(db, email, excludeUserId);
};

/**
 * Create a user
 */
export const createUser = async (db: D1Database, userBody: Omit<User, 'id' | 'is_email_verified'>): Promise<Omit<User, 'password'>> => {
  if (await userRepository.existsByEmail(db, userBody.email)) {
    throw new ApiError(400, 'Email already taken');
  }
  const hashedPassword = await bcrypt.hash(userBody.password!, 8);

  const userToCreate = {
    name: userBody.name,
    email: userBody.email,
    password: hashedPassword,
    role: userBody.role
  };

  const result = await userRepository.create(db, userToCreate);

  if (!result) {
    throw new ApiError(500, 'Could not create user');
  }
  return result;
};

/**
 * Get user by their ID
 */
export const getUserById = async (db: D1Database, id: number): Promise<Omit<User, 'password'> | null> => {
    return await userRepository.findById(db, id);
};

/**
 * Get user by their email (includes password for internal use like login)
 */
export const getUserByEmail = async (db: D1Database, email: string): Promise<User | null> => {
    return await userRepository.findByEmail(db, email);
};

/**
 * Query for users with pagination and filtering
 */
export const queryUsers = async (db: D1Database, filter: any, options: any) => {
  const { limit = 10, page = 1 } = options;
  const { results, totalResults } = await userRepository.findAll(db, filter, options);

  const totalPages = Math.ceil(totalResults / limit);
  
  return {
    results,
    page,
    limit,
    totalPages,
    totalResults
  };
};

/**
 * Update user by their ID
 */
export const updateUserById = async (db: D1Database, userId: number, updateBody: Partial<User>): Promise<Omit<User, 'password'>> => {
  const user = await getUserById(db, userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  if (updateBody.email && (await userRepository.existsByEmail(db, updateBody.email, userId))) {
    throw new ApiError(400, 'Email already taken');
  }

  const updates = { ...updateBody };
  if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 8);
  }

  const result = await userRepository.update(db, userId, updates);

  if (!result) {
    throw new ApiError(500, 'Could not update user');
  }
  return result;
};

/**
 * Delete user by their ID
 */
export const deleteUserById = async (db: D1Database, userId: number): Promise<void> => {
  const user = await getUserById(db, userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  await userRepository.remove(db, userId);
};