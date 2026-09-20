"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const inquiryTypes = [
  "サイトの内容について（誤り・修正依頼）",
  "掲載画像・引用に関するご連絡",
  "企業・メディアの方からのご連絡",
  "その他",
] as const;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function isConfiguredAddress(address?: string) {
  if (!address) return false;
  const normalized = address.trim().toLowerCase();
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) &&
    !normalized.endsWith("@example.com") &&
    !normalized.endsWith("@example.org") &&
    !normalized.endsWith("@example.net") &&
    !normalized.endsWith("@example.invalid")
  );
}

export function ContactForm({ address }: { address?: string }) {
  const contactAddress = address?.trim();
  const available = isConfiguredAddress(contactAddress);
  const [type, setType] = useState<string>(inquiryTypes[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "お名前を入力してください。";
    if (!email.trim()) {
      next.email = "メールアドレスを入力してください。";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "メールアドレスの形式が正しくありません。";
    }
    if (!message.trim()) next.message = "お問い合わせ内容を入力してください。";
    return next;
  };

  // 送信バックエンドを持たないため、入力内容を本文に載せたメール作成画面を開く。
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstInvalid = ["name", "email", "message"].find((field) => found[field as keyof FieldErrors]);
      if (firstInvalid) {
        requestAnimationFrame(() => document.getElementById(`contact-${firstInvalid}`)?.focus());
      }
      return;
    }
    if (!available || !contactAddress) return;

    const subject = `【ファンサイトお問い合わせ】${type}`;
    const body = [
      `お名前: ${name}`,
      `メールアドレス: ${email}`,
      `お問い合わせ種別: ${type}`,
      "",
      "お問い合わせ内容:",
      message,
    ].join("\n");

    window.location.href = `mailto:${contactAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  const fieldClass = (hasError: boolean) =>
    cn(
      "w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-neutral-900 transition-colors duration-200",
      "placeholder:text-neutral-400 focus:outline-none",
      hasError
        ? "border-red-500 focus:border-red-500"
        : "border-neutral-200 focus:border-brand-dark"
    );

  if (!available || !contactAddress) {
    return (
      <div role="status" className="rounded-xl border-2 border-neutral-200 bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-700">
        お問い合わせ窓口は現在準備中です。受付開始までしばらくお待ちください。
      </div>
    );
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contactAddress);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
    }
  };

  return (
    <form
      action={`mailto:${contactAddress}`}
      method="post"
      encType="text/plain"
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
        <span className="break-all">宛先: {contactAddress}</span>
        <button
          type="button"
          onClick={copyAddress}
          className="min-h-11 rounded-full border-2 border-neutral-700 px-4 py-2 font-bold transition-colors hover:bg-neutral-900 hover:text-white"
        >
          {copied ? "コピーしました" : copyFailed ? "コピーできませんでした" : "宛先をコピー"}
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-type" className="text-sm font-bold text-neutral-800">
          お問い合わせ種別
        </label>
        <select
          id="contact-type"
          name="inquiry-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={fieldClass(false)}
        >
          {inquiryTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="text-sm font-bold text-neutral-800">
            お名前 / 会社名
            <span className="ml-1 text-brand-dark">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田 太郎"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name && (
            <p id="contact-name-error" className="text-xs font-bold text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-bold text-neutral-800">
            メールアドレス
            <span className="ml-1 text-brand-dark">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            className={fieldClass(Boolean(errors.email))}
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs font-bold text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="text-sm font-bold text-neutral-800">
          お問い合わせ内容
          <span className="ml-1 text-brand-dark">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="ご用件をご記入ください。"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(fieldClass(Boolean(errors.message)), "resize-y")}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-xs font-bold text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        data-cursor-label="SEND"
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-full",
          "border-2 border-brand-dark bg-brand-dark px-8 py-4 text-sm font-bold text-white",
          "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-lg lg:text-base"
        )}
      >
        メールを作成する
      </button>

      <p aria-live="polite" className="text-xs text-neutral-600">
        {opened
          ? "メールソフトの作成画面を開きました。開かない場合はお手数ですが直接メールをお送りください。"
          : "送信ボタンを押すと、お使いのメールソフトで作成画面が開きます。JavaScriptが利用できる場合は、入力内容を読みやすく整えて本文に入れます。実際の送信はメールソフトから行ってください。"}
      </p>
    </form>
  );
}
