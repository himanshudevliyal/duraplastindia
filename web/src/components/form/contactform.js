"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;

    console.log(form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-primary">
        Thanks — your message has been sent.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Your name*"
          required
          value={form.name}
          onChange={handleChange}
          className="h-12 rounded-full border px-5"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Your phone*"
          required
          value={form.phone}
          onChange={handleChange}
          className="h-12 rounded-full border px-5"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="email"
          name="email"
          placeholder="Your email*"
          required
          value={form.email}
          onChange={handleChange}
          className="h-12 rounded-full border px-5"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject*"
          required
          value={form.subject}
          onChange={handleChange}
          className="h-12 rounded-full border px-5"
        />
      </div>

      <textarea
        name="message"
        rows={6}
        required
        placeholder="Your message*"
        value={form.message}
        onChange={handleChange}
        className="w-full rounded-2xl border p-5"
      />

      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        I agree to the{" "}
        <Link href="/privacy" className="text-primary">
          Privacy Policy
        </Link>
      </label>

      <Button
        disabled={!agreed}
        variant="lg"
        className="bg-primary  text-white"
      >
        Send
      </Button>
    </form>
  );
}
