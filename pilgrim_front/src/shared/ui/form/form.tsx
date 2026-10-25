import { cn } from "@/shared/lib/cn";

import type { InputHTMLAttributes, JSX, ReactNode, TextareaHTMLAttributes } from "react";

import styles from "./form.module.css";

type FieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, htmlFor, required, hint, error, className, children }: FieldProps): JSX.Element {
  return (
    <div className={cn(styles["field"], className)}>
      <label htmlFor={htmlFor} className={styles["label"]}>
        {label}
        {required && (
          <span className={styles["required"]} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className={styles["error"]} role="alert">
          {error}
        </p>
      ) : (
        hint && <p className={styles["hint"]}>{hint}</p>
      )}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function TextInput({ invalid, className, ...rest }: TextInputProps): JSX.Element {
  return <input className={cn(styles["control"], className)} aria-invalid={invalid || undefined} {...rest} />;
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function TextArea({ invalid, className, ...rest }: TextAreaProps): JSX.Element {
  return (
    <textarea
      className={cn(styles["control"], styles["textarea"], className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

type SelectInputProps<Value extends string> = {
  id: string;
  value: Value;
  options: ReadonlyArray<{ value: Value; label: string }>;
  onChange: (value: Value) => void;
  invalid?: boolean;
};

export function SelectInput<Value extends string>({
  id,
  value,
  options,
  onChange,
  invalid,
}: SelectInputProps<Value>): JSX.Element {
  return (
    <select
      id={id}
      className={cn(styles["control"], styles["select"])}
      value={value}
      aria-invalid={invalid || undefined}
      onChange={(event) => onChange(event.target.value as Value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type RadioOption<Value extends string> = {
  value: Value;
  label: string;
};

type RadioGroupProps<Value extends string> = {
  name: string;
  label: string;
  value: Value;
  options: ReadonlyArray<RadioOption<Value>>;
  onChange: (value: Value) => void;
};

export function RadioGroup<Value extends string>({
  name,
  label,
  value,
  options,
  onChange,
}: RadioGroupProps<Value>): JSX.Element {
  return (
    <fieldset className={styles["radio-group"]}>
      <legend className="visually-hidden">{label}</legend>
      {options.map((option) => (
        <label key={option.value} className={styles["radio"]}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

type FormSectionProps = {
  title: string;
  children: ReactNode;
};

export function FormSection({ title, children }: FormSectionProps): JSX.Element {
  return (
    <section className={styles["section"]}>
      <h2 className={styles["section-title"]}>{title}</h2>
      {children}
    </section>
  );
}

export function FormRow({ children }: { children: ReactNode }): JSX.Element {
  return <div className={styles["row"]}>{children}</div>;
}
