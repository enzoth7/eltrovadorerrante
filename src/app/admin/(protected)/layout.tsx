import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logoutAction } from '../actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black bg-blue px-6 py-4 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <Link href="/admin" className="text-sm font-bold uppercase tracking-[0.14em]">Mesa editorial</Link>
          <nav className="flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.1em]">
            <Link href="/admin/escritos/nuevo" className="hover:underline hover:underline-offset-4">Nuevo escrito</Link>
            <Link href="/" className="hover:underline hover:underline-offset-4">Ver sitio</Link>
            <form action={logoutAction}><button type="submit" className="hover:underline hover:underline-offset-4">Salir</button></form>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

