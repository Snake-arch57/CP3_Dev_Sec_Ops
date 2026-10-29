"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { usePlayerProfile } from "@/lib/hooks/usePlayerProfile";
import {
  useCreateEmployee,
  useDeleteEmployee,
  useEmployees,
  useResetEmployeePassword,
} from "@/lib/hooks/useAdmin";
import { ApiError } from "@/lib/api/client";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function AdminPage() {
  const { t } = useLocale();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = usePlayerProfile();
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const resetPassword = useResetEmployeePassword();
  const deleteEmployee = useDeleteEmployee();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState<{ username: string; password: string } | null>(
    null,
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!profileLoading && profile && profile.role !== "ADMIN") {
      router.replace("/");
    }
  }, [profileLoading, profile, router]);

  if (profileLoading || !profile || profile.role !== "ADMIN") {
    return null;
  }

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    createEmployee.mutate(
      { username, displayName, department: department.trim(), password },
      {
        onSuccess: (result) => {
          setRevealedPassword({ username: result.user.username, password: result.temporaryPassword });
          setUsername("");
          setDisplayName("");
          setDepartment("");
          setPassword("");
        },
      },
    );
  }

  function handleResetPassword(employeeId: string, employeeUsername: string) {
    resetPassword.mutate(employeeId, {
      onSuccess: (result) =>
        setRevealedPassword({ username: employeeUsername, password: result.temporaryPassword }),
    });
  }

  function handleDelete(employeeId: string) {
    deleteEmployee.mutate(employeeId, { onSettled: () => setPendingDeleteId(null) });
  }

  return (
    <div>
      <PageHeader title={t("adminPages.pageTitle")} description={t("adminPages.pageDescription")} />

      {revealedPassword && (
        <Card className="mb-4 border-warning/50">
          <CardContent className="flex items-center gap-3 py-4">
            <KeyRound className="h-5 w-5 shrink-0 text-warning" />
            <p className="text-sm">
              {t("adminPages.provisionalPasswordFor")}{" "}
              <span className="font-medium">{revealedPassword.username}</span>:{" "}
              <span className="font-pixel text-xs">{revealedPassword.password}</span>
              <br />
              <span className="text-text-muted">{t("adminPages.provisionalPasswordNote")}</span>
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardContent className="py-5">
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <UserPlus className="h-4 w-4" /> {t("adminPages.registerEmployee")}
          </h3>
          <form onSubmit={handleCreate} className="grid gap-3 sm:grid-cols-2">
            <input
              required
              type="text"
              placeholder={t("adminPages.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
            />
            <input
              required
              placeholder={t("adminPages.fullNamePlaceholder")}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
            />
            <input
              required
              placeholder={t("adminPages.departmentPlaceholder")}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
            />
            <input
              required
              minLength={8}
              type="text"
              placeholder={t("adminPages.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-primary"
            />
            <p className="sm:col-span-2 text-xs text-text-muted">{t("adminPages.passwordHint")}</p>
            {createEmployee.error && (
              <p className="sm:col-span-2 text-sm text-danger">
                {createEmployee.error instanceof ApiError
                  ? createEmployee.error.message
                  : t("adminPages.createFallbackError")}
              </p>
            )}
            <Button type="submit" disabled={createEmployee.isPending} className="sm:col-span-2 w-fit">
              {createEmployee.isPending ? t("adminPages.registering") : t("adminPages.register")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-2">
          {employeesLoading && <p className="py-6 text-center text-sm text-text-muted">{t("common.loading")}</p>}
          <ul className="divide-y divide-border">
            {employees?.map((employee) => (
              <li key={employee.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div className="flex items-center gap-2">
                  {employee.role === "ADMIN" && <ShieldCheck className="h-4 w-4 text-primary" />}
                  <div>
                    <p className="text-sm font-medium">{employee.displayName}</p>
                    <p className="text-xs text-text-muted">
                      @{employee.username} {employee.department ? `· ${employee.department}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {employee.mustChangePassword && (
                    <Badge variant="warning">{t("adminPages.provisionalPasswordBadge")}</Badge>
                  )}
                  <span className="font-pixel text-[10px] text-text-muted">
                    {t("adminPages.levelAbbrev", { level: employee.level })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetPassword(employee.id, employee.username)}
                    disabled={resetPassword.isPending}
                  >
                    <KeyRound className="h-3.5 w-3.5" /> {t("adminPages.resetPassword")}
                  </Button>
                  {employee.id !== profile.id && pendingDeleteId === employee.id && (
                    <>
                      <span className="text-xs text-danger">{t("adminPages.removeConfirm")}</span>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        disabled={deleteEmployee.isPending}
                      >
                        {t("common.confirm")}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setPendingDeleteId(null)}>
                        {t("common.cancel")}
                      </Button>
                    </>
                  )}
                  {employee.id !== profile.id && pendingDeleteId !== employee.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPendingDeleteId(employee.id)}
                      disabled={deleteEmployee.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
