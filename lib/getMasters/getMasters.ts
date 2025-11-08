export async function getMasters() {
  const base = process.env.NEXT_PUBLIC_APP_URL; 

  const [deptRes, stateRes] = await Promise.all([
    fetch(`${base}/api/departments`, {
      next: { revalidate: 86400 }, 
    }),
    fetch(`${base}/api/states`, {
      next: { revalidate: 86400 },
    }),
  ]);

  if (!deptRes.ok || !stateRes.ok) {
    throw new Error("Failed to fetch masters");
  }

  const { departments } = await deptRes.json();
  const { states } = await stateRes.json();

  return {
    departments,
    states,
  };
}
