import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { CAMPS_DATA, campSchema, breadcrumbSchema } from '@/lib/structured-data';
import BeachCampClient from './BeachCampClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    en: 'Beach Surf Camp Sri Lanka — Beachfront in Weligama',
    de: 'Beach Surfcamp Sri Lanka — direkt am Strand in Weligama',
  };
  const descByLocale: Record<string, string> = {
    en:
      'The Surfer Beach Camp in Weligama — steps from the south coast surf break. ISA-certified instructors, pool, restaurant, yoga area. Peak European season Nov–Apr. 4.9 ⭐ 1600+ reviews.',
    de:
      'The Surfer Beach Camp in Weligama — direkt an der Surf-Welle der Südküste. ISA-zertifizierte Surflehrer, Pool, Restaurant, Yoga-Bereich. Europäische Hauptsaison Nov–Apr. 4,9 ⭐ 1600+ Bewertungen.',
  };
  return buildPageMetadata({
    slug: '/beach-camp',
    title: titleByLocale[locale] || titleByLocale.en,
    description: descByLocale[locale] || descByLocale.en,
    image: '/beachcamp.jpg',
    locale,
  });
}

export default async function BeachCampPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const camp = CAMPS_DATA.find((c) => c.id === 'beach')!;
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
      <BeachCampClient />
    </>
  );
}
