import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { RequireRole } from "../auth/roles.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { JwtPayload } from "../auth/jwt-payload";
import { ZodValidationPipe } from "../common/zod-validation.pipe";
import { AdminService } from "./admin.service";
import { CreateEmployeeDto } from "./dto";

@Controller("admin/employees")
@UseGuards(AuthGuard, RequireRole("ADMIN"))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  list() {
    return this.adminService.listEmployees();
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateEmployeeDto)) dto: CreateEmployeeDto) {
    return this.adminService.createEmployee(dto);
  }

  @Post(":id/reset-password")
  resetPassword(@Param("id") id: string) {
    return this.adminService.resetPassword(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() currentUser: JwtPayload) {
    return this.adminService.deleteEmployee(id, currentUser.sub);
  }
}
