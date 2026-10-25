import { LoginPanel } from "@/features/editor/ui/login-panel";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Вход для кураторов",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Вход для кураторов</h1>
      <p className="page-lead">
        В демо-версии пароль не нужен — выберите роль. В рабочей версии аккаунты кураторам выдаёт организатор.
      </p>
      <div className="page-body">
        <LoginPanel />
      </div>
    </div>
  );
}
