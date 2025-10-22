import "../../../app/globals.css";
import { contextProvider as ContextProvider } from "../../../context/context";
import Spinner from "@/components/loader";

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
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider>
          <Spinner />
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
