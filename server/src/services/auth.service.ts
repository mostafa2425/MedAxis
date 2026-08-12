import { userRepo } from '../repositories/user.repo';
import { hashPassword, comparePassword, generateToken, type JwtPayload } from '../utils/auth';
import { UnauthorizedError, ConflictError, BadRequestError } from '../utils/errors';

class AuthService {
  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedError('Account is deactivated');

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    const { password: _pw, ...safeUser } = user;

    return {
      token,
      user: {
        id: safeUser.id,
        email: safeUser.email,
        name: safeUser.name,
        phone: safeUser.phone,
        role: safeUser.role,
        isActive: safeUser.isActive,
      },
    };
  }

  async register(email: string, password: string, name: string, phone?: string) {
    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) throw new ConflictError('User with this email');

    const hashedPassword = await hashPassword(password);
    const user = await userRepo.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new UnauthorizedError('User not found');
    return user;
  }
}

export const authService = new AuthService();
