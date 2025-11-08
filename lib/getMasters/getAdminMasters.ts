import { getMasters } from "./getMasters";

export async function getAdminMasters() {
  const { departments, states } = await getMasters();
  return { departments, states };
}
