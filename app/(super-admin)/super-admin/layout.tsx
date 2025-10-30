import "../../../app/globals.css";
import { contextProvider as ContextProvider } from "../../../context/context";
import Spinner from "@/components/loader";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { getAdminFromToken } from "../../../lib/auth";
import type { TokenPayloadT, Permission } from "@/lib/types";

export const metadata = {
  title: "Super Admin Dashboard",
  description: "Manage departments, states, and admins",
};
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("egov_token")?.value || null;
  const admin = token ? await getAdminFromToken(token) : null;
  const initialUser = admin
    ? (() => {
        const payload = admin as TokenPayloadT;
        const id = String(payload.id ?? payload.sub ?? "");
        const name = String(payload.name ?? "");
        const role = String(payload.role ?? "SuperAdmin");
        const permissions = Array.isArray(payload.permissions)
          ? (payload.permissions as unknown as Permission[])
          : [];
        return { id, name, role, permissions };
      })()
    : null;

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider initialUser={initialUser}>
          <Toaster />
          <Spinner />
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
