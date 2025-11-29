import * as bcrypt from 'bcrypt-ts';
import { Context } from 'hono';
import { verify } from 'hono/jwt';
import { ApiError } from '@/utils/ApiError';
import * as userService from './user.service';
import * as tokenService from './token.service';
import * as tokenRepository from '@/repositories/token.repository';
import { tokenTypes } from '@/config/tokens';

/**
 * Login with username and password
 */
export const loginUserWithEmailAndPassword = async (db: D1Database, email: string, password: string) => {
  const user = await userService.getUserByEmail(db, email);
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }
  delete user.password;
  return user;
};

/**
 * Logout
 */
export const logout = async (db: D1Database, refreshToken: string) => {
    const tokenDoc = await tokenRepository.findOne(db, refreshToken, tokenTypes.REFRESH);
    
    if (!tokenDoc) {
        throw new ApiError(404, 'Not found');
    }
    // Delete the token from the database
    await tokenRepository.deleteById(db, tokenDoc.id);
};

/**
 * Refresh auth tokens
 */
export const refreshAuth = async (c: Context, refreshToken: string) => {
    try {
        const payload = await verify(refreshToken, c.env.JWT_SECRET);
        if (typeof payload.sub !== 'number' || payload.type !== tokenTypes.REFRESH) {
            throw new Error();
        }
        await tokenService.verifyToken(c.env.DB, refreshToken, tokenTypes.REFRESH);
        const user = await userService.getUserById(c.env.DB, payload.sub);
        if (!user) {
            throw new Error();
        }
        // Delete the used refresh token
        await tokenRepository.deleteByToken(c.env.DB, refreshToken);
        
        return tokenService.generateAuthTokens(c, user.id);
    } catch (error) {
        throw new ApiError(401, 'Please authenticate');
    }
};

/**
 * Reset password
 */
export const resetPassword = async (c: Context, resetPasswordToken: string, newPassword : string) => {
    try {
        const payload = await verify(resetPasswordToken, c.env.JWT_SECRET);
        if (typeof payload.sub !== 'number' || payload.type !== tokenTypes.RESET_PASSWORD) {
            throw new Error();
        }
        await tokenService.verifyToken(c.env.DB, resetPasswordToken, tokenTypes.RESET_PASSWORD);
        const user = await userService.getUserById(c.env.DB, payload.sub);
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(c.env.DB, user.id, { password: newPassword });
        // Delete all password reset tokens for this user
        await tokenRepository.deleteByUserAndType(c.env.DB, user.id, tokenTypes.RESET_PASSWORD);
    } catch (error) {
        throw new ApiError(401, 'Password reset failed');
    }
};

/**
 * Verify email
 */
export const verifyEmail = async (c: Context, verifyEmailToken: string) => {
    try {
        const payload = await verify(verifyEmailToken, c.env.JWT_SECRET);
        if (typeof payload.sub !== 'number' || payload.type !== tokenTypes.VERIFY_EMAIL) {
            throw new Error();
        }
        await tokenService.verifyToken(c.env.DB, verifyEmailToken, tokenTypes.VERIFY_EMAIL);
        const user = await userService.getUserById(c.env.DB, payload.sub);
        if (!user) {
            throw new Error();
        }
        await userService.updateUserById(c.env.DB, user.id, { is_email_verified: 1 });
        // Delete all email verification tokens for this user
        await tokenRepository.deleteByUserAndType(c.env.DB, user.id, tokenTypes.VERIFY_EMAIL);
    } catch (error) {
        throw new ApiError(401, 'Email verification failed');
    }
};