"use client";

import { useId } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX } from "react";

import styles from "./search-input.module.css";

type SearchInputProps = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
};

export function SearchInput({ label, value, placeholder, onChange, className }: SearchInputProps): JSX.Element {
  const id = useId();

  return (
    <div className={cn(styles["field"], className)}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <Icon name="search" size={18} className={styles["icon"]} />
      <input
        id={id}
        type="search"
        className={styles["input"]}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button type="button" className={styles["clear"]} onClick={() => onChange("")} aria-label="Очистить поиск">
          <Icon name="close" size={16} />
        </button>
      )}
    </div>
  );
}
