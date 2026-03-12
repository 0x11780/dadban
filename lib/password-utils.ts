/** قوانین امنیتی رمز عبور */
export const PASSWORD_RULES = {
  minLength: 8,
  hasUppercase: /[A-Z]/.test.bind(/[A-Z]/),
  hasLowercase: /[a-z]/.test.bind(/[a-z]/),
  hasNumber: /[0-9]/.test.bind(/[0-9]/),
  hasSpecial: /[$@#!%*?&#^()[\]{}_\-+=.,:;]/.test.bind(/[$@#!%*?&#^()[\]{}_\-+=.,:;]/),
} as const;

export type PasswordCheck = {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
};

export function checkPassword(password: string): PasswordCheck {
  return {
    minLength: password.length >= PASSWORD_RULES.minLength,
    hasUppercase: PASSWORD_RULES.hasUppercase(password),
    hasLowercase: PASSWORD_RULES.hasLowercase(password),
    hasNumber: PASSWORD_RULES.hasNumber(password),
    hasSpecial: PASSWORD_RULES.hasSpecial(password),
  };
}

export function isPasswordSecure(password: string): boolean {
  const c = checkPassword(password);
  return c.minLength && c.hasUppercase && c.hasLowercase && c.hasNumber && c.hasSpecial;
}

export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  const c = checkPassword(password);
  let score = 0;
  if (c.minLength) score += 20;
  if (c.hasUppercase) score += 20;
  if (c.hasLowercase) score += 20;
  if (c.hasNumber) score += 20;
  if (c.hasSpecial) score += 20;
  return score;
}
