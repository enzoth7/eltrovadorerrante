'use client';

import { deletePostAction } from '@/app/admin/actions';

export default function DeletePostButton({ id, slug }: { id: string; slug: string }) {
  const action = deletePostAction.bind(null, id, slug);
  return (
    <form action={action} onSubmit={(event) => { if (!window.confirm('¿Eliminar este escrito? Esta acción no se puede deshacer.')) event.preventDefault(); }}>
      <button type="submit" className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4">Eliminar escrito</button>
    </form>
  );
}

