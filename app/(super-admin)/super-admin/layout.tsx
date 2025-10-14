import "../../../app/globals.css";
import Container from "../../../components/container";
import { cookies } from "next/headers";
import { verifyToken } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { SuperAdminDrawer } from "../../../components/superAdmin/drawer";
import { SuperAdminNavbar } from "../../../components/superAdmin/navbar";
import { contextProvider as ContextProvider } from "../../../context/context";

export const metadata = {
  title: "Super Admin Dashboard",
  description: "Manage departments, states, and admins",
};
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const token = c.get("egov_token")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload || (payload as any).role !== "SuperAdmin") {
    //redirect("/super-admin/login");
  }

  return (
    <ContextProvider>
      <main className="py-8">
        
        <SuperAdminNavbar />
        <SuperAdminDrawer />
        <main>{children}</main>
      </main>
    </ContextProvider>
  );
}
