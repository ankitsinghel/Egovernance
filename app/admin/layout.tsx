import "@/app/globals.css";
import { contextProvider as ContextProvider } from "../../context/context";
import Spinner from "@/components/loader";

export const metadata = {
  title: "Admin Dashboard",
  description: "Manage Complaints",
};
export default async function AdminLayout({
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
