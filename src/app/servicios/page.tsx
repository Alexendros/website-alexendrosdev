import type { Metadata } from "next";
import { ServicesView } from "@/components/sections/services/ServicesView";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Consultoría en platform engineering, cloud-native y desarrollo fullstack. Planes por proyecto o retainer, precios fijos y sin sorpresas.",
};

export default function ServicesPage() {
  return <ServicesView />;
}
