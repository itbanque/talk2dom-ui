// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-auto py-8 text-center text-sm text-gray-500 border-t border-gray-200/50">
      <div className="mb-2">
        <a href="/terms" className="mx-2 hover:underline">Terms</a>|
        <a href="/privacy" className="mx-2 hover:underline">Privacy</a>|
        <a href="/about" className="mx-2 hover:underline">About</a>|
        <a href="/status" className="mx-2 hover:underline">Status</a>
      </div>
      © {new Date().getFullYear()} Talk2Dom – Built with ❤️ from Itbanque
    </footer>
  );
}