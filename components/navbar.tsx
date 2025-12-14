import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  activePage: "orders" | "dashboard";
}

export function Navbar({ activePage }: NavbarProps) {
  return (
    <header className="shrink-0 border-b border-[color:rgba(0,0,0,0.08)] bg-[var(--primary)] px-6 py-3 text-[var(--primary-dark)] shadow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-semibold text-white">
            Control de Bultos
          </h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className={`text-sm font-medium underline-offset-2 ${
                activePage === "orders"
                  ? "font-semibold text-white underline"
                  : "text-white/80 hover:text-white hover:underline"
              }`}
            >
              Órdenes
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium underline-offset-2 ${
                activePage === "dashboard"
                  ? "font-semibold text-white underline"
                  : "text-white/80 hover:text-white hover:underline"
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <Image
          src="/logo-Comeca.png"
          alt="Logo Comeca"
          width={120}
          height={48}
          className="h-16 w-auto object-contain mr-4"
          priority
        />
      </div>
    </header>
  );
}
