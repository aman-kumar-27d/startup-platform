import type { ReactNode } from "react";

import { InternalLayoutShell } from "./components/InternalLayoutShell";

export const metadata = {
  title: "Internal",
  description: "Internal dashboard",
};

export default function InternalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <InternalLayoutShell>{children}</InternalLayoutShell>;
}
