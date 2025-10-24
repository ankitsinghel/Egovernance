import "@/app/globals.css";
import { contextProvider as ContextProvider } from "../../context/context";
import Spinner from "@/components/loader";
import { cookies } from "next/headers";
import { getAdminFromToken } from "../../lib/auth";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage Complaints",
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("egov_token")?.value || null;
  const admin = token ? await getAdminFromToken(token) : null;
  const initialUser = admin
    ? {
        id: String((admin as any).id),
        name: (admin as any).name || (admin as any).email || "",
        role: (admin as any).role || "Admin",
      }
    : null;
   console.log("Admin Layout admin",initialUser);  
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
