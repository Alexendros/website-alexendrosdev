"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

type ConversionEvent =
  | { event: "checkout_completed"; session_id?: string }
  | { event: "checkout_started"; item_id: string }
  | { event: "newsletter_confirmed" }
  | { event: "newsletter_failed" };

/**
 * Cliente component that fires a Vercel Analytics conversion event once on
 * mount.  Place it inside any Server Component that represents a conversion
 * landing page (checkout success, newsletter confirmed, etc.).
 *
 * The corresponding Goals must be created in the Vercel Dashboard:
 *   Analytics → Settings → Goals → Add Goal
 * using the exact event name strings below.
 */
export function ConversionTracker(props: ConversionEvent) {
  useEffect(() => {
    // Fire after a microtask so the page content renders first.
    const id = setTimeout(() => {
      if (props.event === "checkout_completed") {
        const data = props.session_id ? { session_id: props.session_id } : undefined;
        track(props.event, data);
      } else {
        track(props.event);
      }
    }, 0);
    return () => clearTimeout(id);
    // Only fire once on mount — intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
