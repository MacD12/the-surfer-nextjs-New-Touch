import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { CAMPS_DATA, campSchema, breadcrumbSchema } from '@/lib/structured-data';
import TsCampClient from './TsCampClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    en: 'TS2 Surf Camp Weligama — Budget Surf Stay Sri Lanka',
    de: 'TS2 Surfcamp Weligama — Günstig Surfen in Sri Lanka',
  };
  const descByLocale: Record<string, string> = {
    en:
      'Sleep cheap, surf with us. TS2 Camp in Weligama — private AC rooms, 5-min shuttle to Beach Camp where all surf, yoga and dinners happen. Ideal European budget option. 4.9 ⭐ 1600+ reviews.',
    de:
      'Günstig schlafen, mit uns surfen. TS2 Camp in Weligama — private Klimazimmer, 5 Min Shuttle zum Beach Camp, wo alle Surf-, Yoga- und Dinner-Sessions stattfinden. Perfekt für Europäer mit Budget. 4,9 ⭐ 1600+ Bewertungen.',
  };
  return buildPageMetadata({
    slug: '/ts2-camp',
    title: titleByLocale[locale] || titleByLocale.en,
    description: descByLocale[locale] || descByLocale.en,
    image: '/ts2camp.jpg',
    locale,
  });
}

export default async function TsCampPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const camp = CAMPS_DATA.find((c) => c.id === 'ts2')!;
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
      <TsCampClient />
    </>
  );
}
