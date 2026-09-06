import { redirect } from 'next/navigation';
import { loginAction } from '../actions';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Acceso editorial', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/admin');

  return (
    <section className="min-h-[calc(100vh-10rem)] bg-blue px-6 py-20 text-white sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Archivo privado</p>
          <h1 className="mt-5 max-w-xl text-6xl font-bold uppercase leading-[0.85] tracking-[-0.055em] md:text-8xl">Mesa editorial</h1>
          <p className="mt-8 max-w-md font-article text-xl leading-relaxed text-white/75">Un espacio simple para escribir, guardar borradores y publicar cuando el texto esté listo.</p>
        </div>
        <form action={loginAction} className="bg-white p-7 text-black sm:p-10">
          <h2 className="text-2xl font-bold uppercase text-blue">Ingresar</h2>
          {error && <p role="alert" className="mt-5 border-l-2 border-blue pl-4 text-sm">{error}</p>}
          <label className="mt-8 block text-xs font-semibold uppercase tracking-[0.12em]" htmlFor="email">Correo</label>
          <input className="mt-2 min-h-12 w-full border border-black px-4 outline-none focus:ring-2 focus:ring-blue" id="email" name="email" type="email" autoComplete="email" required />
          <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.12em]" htmlFor="password">Contraseña</label>
          <input className="mt-2 min-h-12 w-full border border-black px-4 outline-none focus:ring-2 focus:ring-blue" id="password" name="password" type="password" autoComplete="current-password" required />
          <button className="mt-8 min-h-12 w-full bg-blue px-6 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-black" type="submit">Entrar al panel</button>
        </form>
      </div>
    </section>
  );
}

