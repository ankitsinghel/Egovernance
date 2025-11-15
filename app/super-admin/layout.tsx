import "@/app/globals.css";
import { contextProvider as ContextProvider } from "@/context/context";
import Spinner from "@/components/loader";
import { Toaster } from "sonner";
import { getUserFromCookie } from "../../lib/auth";
import { getAdminMasters } from "@/lib/getMasters/getAdminMasters";

export const metadata = {
  title: "Satark- Super Admin Dashboard",
  description: "Manage departments, states, and admins",
};
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { departments, states } = await getAdminMasters();
  const initialUser = await getUserFromCookie();

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider
          initialUser={initialUser}
          initialDepartments={departments}
          initialStates={states}
        >
          <Toaster />
          <Spinner />
          <main>{children}</main>
        </ContextProvider>
      </body>
    </html>
  );
}
