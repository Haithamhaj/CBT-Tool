"use client";

import { useId, useState } from "react";

export function HelpTip({
  label,
  content
}: {
  label: string;
  content: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="help-tip">
      <button
        type="button"
        className="help-trigger"
        aria-label={label}
        aria-describedby={id}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="help-trigger-mark">?</span>
      </button>
      <span id={id} role="tooltip" className={open ? "help-content visible" : "help-content"}>
        {content}
      </span>
    </span>
  );
}
