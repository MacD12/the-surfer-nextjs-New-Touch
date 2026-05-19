import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { CAMPS_DATA, campSchema, breadcrumbSchema } from '@/lib/structured-data';
import SoulSurferClient from './SoulSurferClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    en: 'Soul Surfer Camp Sri Lanka — Independent Surf Retreat Weligama',
    de: 'Soul Surfer Camp Sri Lanka — Unabhängiges Surf-Retreat Weligama',
  };
  const descByLocale: Record<string, string> = {
    en:
      'Soul Surfer Camp — independent retreat in Weligama for the dedicated surfer. Rooftop infinity pool, rooftop restaurant with panoramic sea views, own private schedule of sessions. 4.9 ⭐ 1600+ reviews.',
    de:
      'Soul Surfer Camp — unabhängiges Retreat in Weligama für den engagierten Surfer. Rooftop-Infinity-Pool, Dachterrassen-Restaurant mit Panoramablick aufs Meer, eigener privater Surf-Plan. 4,9 ⭐ 1600+ Bewertungen.',
  };
  return buildPageMetadata({
    slug: '/soul-surfer',
    title: titleByLocale[locale] || titleByLocale.en,
    description: descByLocale[locale] || descByLocale.en,
    image: '/soul_surfer/hero.jpg',
    locale,
  });
}

export default async function SoulSurferPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const camp = CAMPS_DATA.find((c) => c.id === 'soul')!;
  const schemas: StructuredData[] = [
    campSchema(camp, locale),
    breadcrumbSchema(locale, [
      { name: 'Sri Lanka', slug: '/srilanka' },
      { name: camp.name, slug: camp.slug },
    ]),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
      <SoulSurferClient />
    </>
  );
}
