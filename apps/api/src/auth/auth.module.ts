import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { segredoJwt } from "../config";

@Module({
  imports: [
    JwtModule.registerAsync({
      // `registerAsync` para o segredo só ser lido quando o módulo é
      // instanciado. Com `register` a chamada aconteceria na importação do
      // arquivo, e em produção sem JWT_SECRET a exceção subiria antes do Nest
      // ter como reportar de onde veio.
      useFactory: () => ({ secret: segredoJwt() }),
    }),
  ],
  providers: [AuthService, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
