export const config = {
  jwt: {
    // These values ​​will be taken from c.env in service
    accessExpirationMinutes: 30,
    refreshExpirationDays: 30,
    resetPasswordExpirationMinutes: 10,
    verifyEmailExpirationMinutes: 10,
  }
};