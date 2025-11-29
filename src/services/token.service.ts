import { sign } from 'hono/jwt';
import { Context } from 'hono';
import { ApiError } from '@/utils/ApiError';
import { tokenTypes } from '@/config/tokens';
import * as userService from './user.service';
import * as tokenRepository from '@/repositories/token.repository';
import type { User } from './user.service';

// --- Helper Functions ---
const getJwtConfig = (c: Context) => ({
    secret: c.env.JWT_SECRET,
    accessExpMinutes: parseInt(c.env.JWT_ACCESS_EXPIRATION_MINUTES) || 30,
    refreshExpDays: parseInt(c.env.JWT_REFRESH_EXPIRATION_DAYS) || 30,
    resetPwdExpMinutes: parseInt(c.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) || 10,
    verifyEmailExpMinutes: parseInt(c.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES) || 10,
});

const generateToken = async (c: Context, userId: number, expires: number, type: string) => {
  const secret = c.env.JWT_SECRET;
  const payload = { sub: userId, iat: Math.floor(Date.now() / 1000), exp: expires, type };
  return sign(payload, secret);
};

const saveToken = async (db: D1Database, token: string, userId: number, expires: number, type: string) => {
    const expiresDate = new Date(expires * 1000).toISOString();
    await tokenRepository.create(db, {
      token,
      user_id: userId,
      type,
      expires: expiresDate
    });
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 */
export const verifyToken = async (db: D1Database, token: string, type: string) => {
    const tokenDoc = await tokenRepository.findOne(db, token, type);
    if (!tokenDoc) {
      throw new Error('Token not found in DB');
    }
    return tokenDoc;
};


// --- Main Exported Functions ---

/**
 * Generate auth tokens (access and refresh)
 */
export const generateAuthTokens = async (c: Context, userId: number) => {
    const { accessExpMinutes, refreshExpDays } = getJwtConfig(c);

    const accessTokenExpires = Math.floor(Date.now() / 1000) + accessExpMinutes * 60;
    const accessToken = await generateToken(c, userId, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = Math.floor(Date.now() / 1000) + refreshExpDays * 24 * 60 * 60;
    const refreshToken = await generateToken(c, userId, refreshTokenExpires, tokenTypes.REFRESH);
    await saveToken(c.env.DB, refreshToken, userId, refreshTokenExpires, tokenTypes.REFRESH);

    return {
        access: { token: accessToken, expires: new Date(accessTokenExpires * 1000) },
        refresh: { token: refreshToken, expires: new Date(refreshTokenExpires * 1000) },
    };
};

/**
 * Generate a password reset token
 */
export const generateResetPasswordToken = async (c: Context, email: string): Promise<string> => {
    const user = await userService.getUserByEmail(c.env.DB, email);
    if (!user) {
        throw new ApiError(404, 'No users found with this email');
    }
    const { resetPwdExpMinutes } = getJwtConfig(c);
    const expires = Math.floor(Date.now() / 1000) + resetPwdExpMinutes * 60;
    const resetPasswordToken = await generateToken(c, user.id, expires, tokenTypes.RESET_PASSWORD);
    await saveToken(c.env.DB, resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
};

/**
 * Generate an email verification token
 */
export const generateVerifyEmailToken = async (c: Context, user: User): Promise<string> => {
    const { verifyEmailExpMinutes } = getJwtConfig(c);
    const expires = Math.floor(Date.now() / 1000) + verifyEmailExpMinutes * 60;
    const verifyEmailToken = await generateToken(c, user.id, expires, tokenTypes.VERIFY_EMAIL);
    await saveToken(c.env.DB, verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};