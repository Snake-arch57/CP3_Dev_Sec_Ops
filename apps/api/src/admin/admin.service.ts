import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { generateTemporaryPassword, hashPassword } from "../common/password.util";
import type { CreateEmployeeDto } from "./dto";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listEmployees() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        displayName: true,
        department: true,
        role: true,
        mustChangePassword: true,
        level: true,
        xp: true,
        createdAt: true,
      },
    });
    return users;
  }

  async createEmployee(dto: CreateEmployeeDto) {
    const existing = await this.prisma.user.findUnique({ where: { username: dto.username.toLowerCase() } });
    if (existing) throw new ConflictException("Já existe um usuário com este nome de usuário.");

    // A senha vem do admin (não é mais gerada). mustChangePassword força a
    // pessoa a trocar no primeiro login, então continua sendo temporária.
    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username.toLowerCase(),
        displayName: dto.displayName,
        department: dto.department,
        passwordHash,
        role: "EMPLOYEE",
        mustChangePassword: true,
      },
      select: { id: true, username: true, displayName: true, department: true, role: true },
    });

    // Devolve a senha para a tela confirmar ao admin qual foi cadastrada.
    return { user, temporaryPassword: dto.password };
  }

  async resetPassword(employeeId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: employeeId } });
    if (!user) throw new NotFoundException("Funcionário não encontrado.");

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);
    await this.prisma.user.update({
      where: { id: employeeId },
      data: { passwordHash, mustChangePassword: true },
    });

    return { temporaryPassword };
  }

  async deleteEmployee(employeeId: string, requestedByUserId: string) {
    if (employeeId === requestedByUserId) {
      throw new BadRequestException("Você não pode remover sua própria conta.");
    }
    const target = await this.prisma.user.findUnique({ where: { id: employeeId } });
    if (!target) throw new NotFoundException("Funcionário não encontrado.");

    if (target.role === "ADMIN") {
      const adminCount = await this.prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        throw new BadRequestException("Não é possível remover o último administrador.");
      }
    }

    await this.prisma.user.delete({ where: { id: employeeId } });
    return { ok: true };
  }
}
