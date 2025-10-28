import "../../../app/globals.css";
import { contextProvider as ContextProvider } from "../../../context/context";
import Spinner from "@/components/loader";
import { Toaster } from "sonner";
import { cookies } from "next/headers";
import { getAdminFromToken } from "../../../lib/auth";
import { User } from "@/lib/types";


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
    ? {
        id: String((admin as User).id),
        name: (admin as User).name || "",
        role: (admin as User).role,
        permissions: (admin as User).permissions,
      }
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
