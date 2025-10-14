import "../../../app/globals.css";

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
 

  return (
    <ContextProvider>
      <main className="py-8">
        <SuperAdminDrawer />
        <SuperAdminNavbar />
        <main>{children}</main>
      </main>
    </ContextProvider>
  );
}
