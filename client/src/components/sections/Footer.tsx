export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-gray-400">
          © {currentYear} Backend Engineer Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
