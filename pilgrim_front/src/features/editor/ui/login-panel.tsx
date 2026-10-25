"use client";

import { useRouter } from "next/navigation";

import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Icon } from "@/shared/ui/icon/icon";
import { Skeleton } from "@/shared/ui/skeleton/skeleton";

import { DEMO_USERS, login, logout, useSession } from "../model/session";

import type { JSX, ReactNode } from "react";

import styles from "./login-panel.module.css";

export function LoginPanel(): JSX.Element {
  const user = useSession();
  const router = useRouter();

  if (user === undefined) {
    return <Skeleton height={260} radius="var(--radius-md)" />;
  }

  if (user) {
    return (
      <div className={styles["signed-in"]}>
        <p>
          Вы вошли как <strong>{user.name}</strong> ({user.roleLabel.toLowerCase()}).
        </p>
        <div className={styles["actions"]}>
          <ButtonLink href="/manage">
            <Icon name="pen" size={18} />
            Открыть редактор
          </ButtonLink>
          <Button variant="outline" onClick={logout}>
            <Icon name="logout" size={18} />
            Выйти
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["roles"]}>
      {DEMO_USERS.map((demoUser) => (
        <section key={demoUser.id} className={styles["role"]} aria-labelledby={`role-${demoUser.id}`}>
          <span className={styles["avatar"]} aria-hidden="true">
            {demoUser.name[0]}
          </span>
          <div className={styles["role-text"]}>
            <h2 id={`role-${demoUser.id}`} className={styles["role-title"]}>
              {demoUser.roleLabel}
            </h2>
            <p className={styles["role-name"]}>{demoUser.name}</p>
            <p className={styles["role-description"]}>{demoUser.description}</p>
          </div>
          <Button
            fullWidth
            onClick={() => {
              login(demoUser.id);
              router.push("/manage");
            }}
          >
            Войти как {demoUser.roleLabel.toLowerCase()}
          </Button>
        </section>
      ))}
    </div>
  );
}

type EditorGateProps = {
  children: ReactNode;
};

export function EditorGate({ children }: EditorGateProps): JSX.Element {
  const user = useSession();

  if (user === undefined) {
    return <Skeleton height={420} radius="var(--radius-md)" />;
  }

  if (!user) {
    return (
      <div className={styles["gate"]}>
        <Icon name="user" size={32} />
        <p className={styles["gate-title"]}>Редактор доступен кураторам</p>
        <p className={styles["gate-text"]}>Войдите, чтобы добавлять посты, мероприятия и фотоальбомы.</p>
        <ButtonLink href="/login">Войти</ButtonLink>
      </div>
    );
  }

  return <>{children}</>;
}
