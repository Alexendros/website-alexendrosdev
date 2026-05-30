import type { Metadata } from "next";
import { ContactView } from "@/components/sections/contact/ContactView";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "¿Tienes un proyecto o reto técnico? Cuéntame en qué estás trabajando y te respondo en menos de 24h.",
};

export default function ContactPage() {
  return <ContactView />;
}
