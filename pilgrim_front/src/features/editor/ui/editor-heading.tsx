"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Icon } from "@/shared/ui/icon/icon";

import { KIND_META } from "../lib/kinds";
import { DemoNotice } from "./editor-buttons";

import type { ContentKind } from "../model/content";
import type { JSX } from "react";

import styles from "./editor-heading.module.css";

type EditorHeadingProps = {
  kind: ContentKind;
};

export function EditorHeading({ kind }: EditorHeadingProps): JSX.Element {
  const isEditing = Boolean(useSearchParams().get("slug"));

  return (
    <header className={styles["heading"]}>
      <Link href="/manage" className={styles["back"]}>
        <Icon name="arrow-left" size={16} />
        Редактор
      </Link>
      <h1 className="page-title">{isEditing ? KIND_META[kind].editTitle : KIND_META[kind].createTitle}</h1>
      <DemoNotice />
    </header>
  );
}
