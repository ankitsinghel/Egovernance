import "../../../app/globals.css";
import { contextProvider as ContextProvider } from "../../../context/context";
import Spinner from "@/components/loader";
import { cookies } from "next/headers";
import { getAdminFromToken } from "../../../lib/auth";

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
  console.log("SuperAdminLayout admin:", admin);
  const initialUser = admin
    ? {
        id: String((admin as any).id),
        name: (admin as any).name || (admin as any).email || "",
        role: (admin as any).role 
      }
    : null;

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider initialUser={initialUser}>
          <Spinner />
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
