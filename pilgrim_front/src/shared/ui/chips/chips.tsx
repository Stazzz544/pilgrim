"use client";

import { cn } from "@/shared/lib/cn";

import type { JSX } from "react";

import styles from "./chips.module.css";

export type ChipOption<Value extends string> = {
  value: Value;
  label: string;
};

type ChipsProps<Value extends string> = {
  label: string;
  options: ReadonlyArray<ChipOption<Value>>;
  selected: readonly Value[];
  onChange: (selected: Value[]) => void;
  allLabel?: string;
  className?: string;
};

export function Chips<Value extends string>({
  label,
  options,
  selected,
  onChange,
  allLabel,
  className,
}: ChipsProps<Value>): JSX.Element {
  const toggle = (value: Value): void => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  return (
    <div role="group" aria-label={label} className={cn(styles["chips"], className)}>
      {allLabel && (
        <button
          type="button"
          className={styles["chip"]}
          aria-pressed={selected.length === 0}
          onClick={() => onChange([])}
        >
          {allLabel}
        </button>
      )}
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles["chip"]}
          aria-pressed={selected.includes(option.value)}
          onClick={() => toggle(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
