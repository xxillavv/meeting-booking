import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мої кімнати",
};

export default function RoomsPage() {
  return <h1 className="text-2xl font-semibold">Мої кімнати</h1>;
}
