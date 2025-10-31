"use client";

import React from "react";

type Props = {
  password: string;
};

function scorePassword(pw: string) {
  let score = 0;
  if (!pw) return 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function PasswordStrength({ password }: Props) {
  const score = scorePassword(password);
  const percent = (score / 4) * 100;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "bg-red-400",
    "bg-red-400",
    "bg-yellow-400",
    "bg-amber-400",
    "bg-green-400",
  ];

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-slate-100 rounded-md overflow-hidden">
        <div
          className={`h-full ${colors[score]} transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">{labels[score]}</p>
    </div>
  );
}
