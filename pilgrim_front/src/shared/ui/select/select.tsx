"use client";

import { useId } from "react";

import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/icon/icon";

import type { JSX } from "react";

import styles from "./select.module.css";

export type SelectOption<Value extends string> = {
  value: Value;
  label: string;
};

type SelectProps<Value extends string> = {
  label: string;
  value: Value;
  options: ReadonlyArray<SelectOption<Value>>;
  onChange: (value: Value) => void;
  hideLabel?: boolean;
  className?: string;
};

export function Select<Value extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel,
  className,
}: SelectProps<Value>): JSX.Element {
  const id = useId();

  return (
    <div className={cn(styles["field"], className)}>
      <label htmlFor={id} className={hideLabel ? "visually-hidden" : styles["label"]}>
        {label}
      </label>
      <div className={styles["control"]}>
        <select
          id={id}
          className={styles["select"]}
          value={value}
          onChange={(event) => onChange(event.target.value as Value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size={16} className={styles["icon"]} />
      </div>
    </div>
  );
}
