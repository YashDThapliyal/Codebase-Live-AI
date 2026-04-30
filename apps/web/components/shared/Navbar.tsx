import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-bold tracking-wide text-slate-900">
          Codebase Live AI
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600">
          <Link href="/candidate/login" className="hover:text-slate-900">Candidate</Link>
          <Link href="/admin/applicants" className="hover:text-slate-900">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
