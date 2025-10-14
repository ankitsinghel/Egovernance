export function Badge({ children, variant = "gray" }: any) {
  const cls =
    variant === "red"
      ? "bg-red-600"
      : variant === "orange"
      ? "bg-orange-500"
      : "bg-gray-400";
  return (
    <span className={`text-white text-xs px-2 py-1 rounded ${cls}`}>
      {children}
    </span>
  );
}
