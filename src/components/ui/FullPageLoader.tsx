// src/components/ui/FullPageLoader.tsx
export default function FullPageLoader({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center !bg-white dark:!bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin animate-pulse" />
        <span className="!text-gray-900 dark:!text-gray-100 text-sm">{message || "Loading..."}</span>
      </div>
    </div>
  );
}