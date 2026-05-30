"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/blog";

export function PostToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;
    const onScroll = () => {
      let cur = items[0].id;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return <nav className="ak-toc" aria-hidden />;

  return (
    <nav className="ak-toc">
      <div className="ak-toc-t">En esta página</div>
      {items.map(({ id, label }) => (
        <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>
          {label}
        </a>
      ))}
    </nav>
  );
}
