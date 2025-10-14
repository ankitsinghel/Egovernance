export function Button({ children, className = "", ...props }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 bg-sky-600 text-white hover:bg-sky-700 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
