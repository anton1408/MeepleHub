import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { bgg } from '@/shared/api/bgg';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const game = await bgg.getGame(id);
  return { title: game ? `${game.name} — MeepleHub` : 'Game not found' };
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  const game = await bgg.getGame(id);

  if (!game) notFound();

  return (
    <main>
      <h1>{game.name}</h1>
      {game.yearPublished && <p>Рік: {game.yearPublished}</p>}
      {game.description && <p>{game.description}</p>}
    </main>
  );
}
