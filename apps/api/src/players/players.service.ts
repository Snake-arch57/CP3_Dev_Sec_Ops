import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { buildPlayerProfile } from "./build-profile";

@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    try {
      return await buildPlayerProfile(this.prisma, userId);
    } catch {
      throw new NotFoundException("Perfil não encontrado.");
    }
  }
}
