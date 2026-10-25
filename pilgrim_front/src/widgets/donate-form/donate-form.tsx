"use client";

import { useId, useState } from "react";

import { SITE } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import { Button, ButtonLink } from "@/shared/ui/button/button";
import { Card } from "@/shared/ui/card/card";
import { Icon } from "@/shared/ui/icon/icon";
import { Modal } from "@/shared/ui/modal/modal";

import type { FormEvent, JSX } from "react";

import styles from "./donate-form.module.css";

const PRESETS = [300, 500, 1000, 2000];
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 300_000;

type Frequency = "once" | "monthly";

const FREQUENCIES: Array<{ value: Frequency; label: string }> = [
  { value: "once", label: "Разово" },
  { value: "monthly", label: "Ежемесячно" },
];

const formatRub = (amount: number): string => `${amount.toLocaleString("ru-RU")} ₽`;

export function DonateForm(): JSX.Element {
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [preset, setPreset] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const customId = useId();
  const errorId = useId();

  const amount = preset ?? Number(customAmount.replace(/\s/g, ""));
  const isValid = Number.isFinite(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  const showError = isTouched && !isValid;

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsTouched(true);

    if (isValid) {
      setIsDemoOpen(true);
    }
  };

  return (
    <Card as="section" padding="lg" className={styles["card"]} aria-labelledby="donate-form-title">
      <h2 id="donate-form-title" className={styles["title"]}>
        Сумма поддержки
      </h2>

      <form className={styles["form"]} onSubmit={handleSubmit} noValidate>
        <fieldset className={styles["segmented"]}>
          <legend className="visually-hidden">Периодичность</legend>
          {FREQUENCIES.map((option) => (
            <label key={option.value} className={styles["segment"]}>
              <input
                type="radio"
                name="frequency"
                value={option.value}
                checked={frequency === option.value}
                onChange={() => setFrequency(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className={styles["amounts"]}>
          <legend className="visually-hidden">Сумма</legend>
          {PRESETS.map((value) => (
            <label key={value} className={styles["amount"]}>
              <input
                type="radio"
                name="amount"
                value={value}
                checked={preset === value}
                onChange={() => {
                  setPreset(value);
                  setCustomAmount("");
                }}
              />
              <span>{formatRub(value)}</span>
            </label>
          ))}
        </fieldset>

        <div className={styles["custom"]}>
          <label htmlFor={customId} className={styles["custom-label"]}>
            Другая сумма
          </label>
          <div className={cn(styles["custom-field"], preset === null && styles["custom-active"])}>
            <input
              id={customId}
              type="text"
              inputMode="numeric"
              placeholder="Например, 1 500"
              value={customAmount}
              aria-invalid={showError}
              aria-describedby={showError ? errorId : undefined}
              onFocus={() => setPreset(null)}
              onChange={(event) => {
                setPreset(null);
                setCustomAmount(event.target.value.replace(/[^\d\s]/g, ""));
              }}
            />
            <span aria-hidden="true">₽</span>
          </div>
          {showError && (
            <p id={errorId} className={styles["error"]}>
              Введите сумму от {formatRub(MIN_AMOUNT)} до {formatRub(MAX_AMOUNT)}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth>
          <Icon name="heart" size={18} />
          {isValid ? `Поддержать на ${formatRub(amount)}` : "Поддержать"}
          {frequency === "monthly" && isValid && " в месяц"}
        </Button>

        <p className={styles["note"]}>
          Оплата проходит на стороне платёжного сервиса — данные карты не попадают на сайт. Ежемесячную подписку можно
          отменить в любой момент.
        </p>
      </form>

      <Modal open={isDemoOpen} onClose={() => setIsDemoOpen(false)} title="Это демо-версия сайта">
        <div className={styles["demo"]}>
          <p>
            В рабочей версии здесь откроется защищённая страница оплаты платёжного сервиса: ЮKassa, CloudPayments или
            Т-Касса, сервис выбирается при подключении. Сейчас деньги не списываются.
          </p>
          <p className={styles["demo-summary"]}>
            Вы выбрали: <strong>{formatRub(amount)}</strong>, {frequency === "monthly" ? "ежемесячно" : "разово"}.
          </p>
          <div className={styles["demo-actions"]}>
            <Button onClick={() => setIsDemoOpen(false)}>Понятно</Button>
            <ButtonLink href={SITE.organizer.vk} variant="outline">
              Написать организатору
            </ButtonLink>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
