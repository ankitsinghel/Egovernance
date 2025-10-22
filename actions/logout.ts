"use server";

import { cookies } from "next/headers";

export async function logout() {
  const c = cookies(); // <-- this returns a Promise-like object type
  c.set("egov_token", "", { path: "/", expires: new Date(0) }); 
}
