import * as authService from '@/services/auth.service';
import * as tokenService from '@/services/token.service';
import * as userService from '@/services/user.service';

export const register = async (c: any) => {
  const body = c.req.valid('json');
  const userToCreate = {
    name: body.name,
    email: body.email,
    password: body.password,
    role: 'user' as const,
  };
  const user = await userService.createUser(c.env.DB, userToCreate);
  const tokens = await tokenService.generateAuthTokens(c, user.id);
  return c.json({ user, tokens }, 201);
};

export const login = async (c: any) => {
    const { email, password } = c.req.valid('json');
    const user = await authService.loginUserWithEmailAndPassword(c.env.DB, email, password);
    const tokens = await tokenService.generateAuthTokens(c, user.id);
    return c.json({ user, tokens });
};

export const logout = async (c: any) => {
    const { refreshToken } = c.req.valid('json');
    await authService.logout(c.env.DB, refreshToken);
    return c.body(null, 204);
};

export const refreshTokens = async (c: any) => {
    const { refreshToken } = c.req.valid('json');
    const tokens = await authService.refreshAuth(c, refreshToken);
    return c.json(tokens);
};

export const forgotPassword = async (c: any) => {
    const { email } = c.req.valid('json');
    await tokenService.generateResetPasswordToken(c, email);
    return c.body(null, 204);
};

export const resetPassword = async (c: any) => {
    const { token } = c.req.valid('query');
    const { password } = c.req.valid('json');
    await authService.resetPassword(c, token, password);
    return c.body(null, 204);
};

export const sendVerificationEmail = async (c: any) => {
    const user = c.get('user');
    await tokenService.generateVerifyEmailToken(c, user);
    return c.body(null, 204);
};

export const verifyEmail = async (c: any) => {
    const { token } = c.req.valid('query');
    await authService.verifyEmail(c, token);
    return c.body(null, 204);
};