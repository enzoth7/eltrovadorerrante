import Link from 'next/link';
import { saveLocationContentAction } from '@/app/admin/actions';

const inputClass = 'mt-3 min-h-[20rem] w-full resize-y border border-black bg-white px-5 py-4 font-article text-lg leading-relaxed outline-none focus:ring-2 focus:ring-blue';

export default function LocationEditor({
  countrySlug,
  countryName,
  placeSlug,
  placeName,
  description,
  error,
  mensaje,
}: {
  countrySlug: string;
  countryName: string;
  placeSlug?: string;
  placeName?: string;
  description?: string;
  error?: string;
  mensaje?: string;
}) {
  const title = placeName ?? countryName;
  const publicPath = placeSlug
    ? `/lugares/${countrySlug}/${placeSlug}`
    : `/lugares/${countrySlug}`;

  return (
    <main className="px-6 py-12 sm:px-8 md:py-16">
      <form action={saveLocationContentAction} className="mx-auto max-w-5xl">
        <input type="hidden" name="countrySlug" value={countrySlug} />
        <input type="hidden" name="placeSlug" value={placeSlug ?? ''} />

        <div className="border-b border-black pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">
            {placeName ? countryName : 'País'}
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-none tracking-[-0.045em] text-blue md:text-7xl">
            {title}
          </h1>
        </div>

        {(error || mensaje) && (
          <p className="mt-8 border-l-2 border-blue pl-4" role={error ? 'alert' : 'status'}>
            {error ?? mensaje}
          </p>
        )}

        <div className="mt-10">
          <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-black/65" htmlFor="description">
            Descripción pública
          </label>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-black/55">
            Este texto aparecerá debajo del nombre en la página pública. Si lo dejás vacío, no se mostrará ningún texto.
          </p>
          <textarea
            className={inputClass}
            id="description"
            name="description"
            defaultValue={description}
            maxLength={4000}
            placeholder={placeName ? `Escribí qué significa ${placeName} dentro de tu recorrido.` : `Describí tu vínculo con ${countryName}.`}
          />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-6">
          <button type="submit" className="min-h-12 bg-blue px-7 text-xs font-bold uppercase tracking-[0.13em] text-white hover:bg-black">
            Guardar descripción
          </button>
          <Link className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4" href="/admin/lugares">
            Volver a lugares
          </Link>
          <Link className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4" href={publicPath}>
            Ver página pública
          </Link>
        </div>
      </form>
    </main>
  );
}
