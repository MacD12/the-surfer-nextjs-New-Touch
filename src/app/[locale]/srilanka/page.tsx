import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { destinationSchema, breadcrumbSchema } from '@/lib/structured-data';
import SrilankaClient from './SrilankaClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    en: 'Surf Camp Sri Lanka — Winter Sun Surfing in Weligama',
    de: 'Surfcamp Sri Lanka — Wintersonne & Wellen in Weligama',
  };
  const descByLocale: Record<string, string> = {
    en:
      'Sri Lanka is Europe’s best winter surf destination — 10-hour flight, +5.5h timezone, 28 °C water, consistent waves Nov–Apr. Three camps in Weligama for every budget. ISA-certified instructors.',
    de:
      'Sri Lanka ist Europas bestes Winter-Surfziel — 10 Stunden Flug, +5,5h Zeitzone, 28 °C Wassertemperatur, konstante Wellen Nov–Apr. Drei Camps in Weligama für jedes Budget. ISA-zertifizierte Surflehrer.',
  };
  return buildPageMetadata({
    slug: '/srilanka',
    title: titleByLocale[locale] || titleByLocale.en,
    description: descByLocale[locale] || descByLocale.en,
    image: '/arugambay_surf.jpg',
    locale,
  });
}

export default async function SrilankaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const schemas: StructuredData[] = [
    destinationSchema({
      locale,
      slug: '/srilanka',
      name: 'Surf Sri Lanka',
      description:
        'Sri Lanka south coast surf destination — Weligama Bay, consistent waves November to April, three camps run by The Surfer for European travellers.',
      countryCode: 'LK',
      image: '/arugambay_surf.jpg',
      geo: { latitude: 5.969813, longitude: 80.446938 },
    }),
    breadcrumbSchema(locale, [{ name: 'Sri Lanka', slug: '/srilanka' }]),
  ];

  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
      <SrilankaClient />
    </>
  );
}
