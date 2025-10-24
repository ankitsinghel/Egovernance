"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { context } from "@/context/context";
import * as Collapsible from "@radix-ui/react-collapsible";
import {
  ChevronLeft,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type RouteItem = { name: string; href: string; icon: ReactNode };


const SuperAdminDashboard = ({ children, routes }: { children: ReactNode, routes: RouteItem[] }) => {
  const { superAdminDrawerOpen, setSuperAdminDrawerOpen } = context();
  return (
    <div className="flex">
      <Collapsible.Root
        className="fixed top-0 left-0 z-20 h-dvh"
        open={superAdminDrawerOpen}
        onOpenChange={setSuperAdminDrawerOpen}
      >
        <Collapsible.Content forceMount>
          <div
            className={`fixed top-0 left-0 z-50 h-full w-80 bg-gray-50 p-4 shadow-lg transition-transform duration-300 ease-in-out sm:w-64 ${
              superAdminDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="mb-4 flex items-center justify-center">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <Collapsible.Trigger asChild>
                <Button
                  size="icon"
                  variant="link"
                  className="ml-auto cursor-pointer bg-transparent text-black hover:scale-110"
                >
                  <ChevronLeft></ChevronLeft>
                </Button>
              </Collapsible.Trigger>
            </div>
            <Separator className="my-2 h-1 bg-gray-400" />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={
                superAdminDrawerOpen
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`flex flex-col gap-2 ${
                !superAdminDrawerOpen ? "pointer-events-none" : ""
              }`}
            >
              {routes.map((r) => (
                <Button
                  key={r.href}
                  className="w-full justify-start font-normal"
                  variant={usePathname() === r.href ? "default" : "ghost"}
                  asChild
                >
                  <Link
                    className={`flex items-center rounded-md px-5 py-1 transition-all ${
                      usePathname() === r.href
                        ? "bg-gray-300 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                    href={r.href}
                  >
                    {r.icon} <span className="text-sm">{r.name}</span>
                  </Link>
                </Button>
              ))}
            </motion.div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
      <main
        className={`mt-13 h-dvh container w-full  transition-all duration-300 ease-in-out ${
          superAdminDrawerOpen ? "blur-xs sm:ml-60" : ""
        } `}
      >
        {children}
      </main>
    </div>
  );
};

export { SuperAdminDashboard };
