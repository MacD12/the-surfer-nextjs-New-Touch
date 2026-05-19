import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { CAMPS_DATA, campSchema, breadcrumbSchema } from '@/lib/structured-data';
import StyleCampClient from './StyleCampClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    en: 'SurfStyle Camp Morocco — Taghazout / Tamraght Surf Camp',
    de: 'SurfStyle Camp Marokko — Surfcamp Taghazout / Tamraght',
  };
  const descByLocale: Record<string, string> = {
    en:
      'The Surfer SurfStyle Camp in Tamraght, Morocco — a 4-hour direct flight from European hubs. Anchor Point and Killer Point on your doorstep, beginner to advanced coaching, optional yoga. Year-round surf, EU peak season Oct–Apr.',
    de:
      'The Surfer SurfStyle Camp in Tamraght, Marokko — 4-Stunden-Direktflug von europäischen Hubs. Anchor Point und Killer Point direkt vor der Haustür, Anfänger- bis Fortgeschrittenen-Coaching, optionales Yoga. Ganzjährig surfen, EU-Hauptsaison Okt–Apr.',
  };
  return buildPageMetadata({
    slug: '/style-camp',
    title: titleByLocale[locale] || titleByLocale.en,
    description: descByLocale[locale] || descByLocale.en,
    image: '/surfstyle.jpg',
    locale,
  });
}

export default async function StyleCampPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const camp = CAMPS_DATA.find((c) => c.id === 'style')!;
  const schemas: StructuredData[] = [
    campSchema(camp, locale),
    breadcrumbSchema(locale, [
      { name: 'Morocco', slug: '/morocco' },
      { name: camp.name, slug: camp.slug },
    ]),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
      <StyleCampClient />
    </>
  );
}
