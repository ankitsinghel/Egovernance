import "@/app/globals.css";
import { contextProvider as ContextProvider } from "../../context/context";
import Spinner from "@/components/loader";
import { getUserFromCookie } from "../../lib/auth";
import { Toaster } from "sonner";

export const metadata = {
  title: "Satark- Admin Dashboard",
  description: "Manage Complaints",
};
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getUserFromCookie();
  //  console.log("Admin Layout admin",initialUser);
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
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
