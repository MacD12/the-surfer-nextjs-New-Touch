import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';
import RatesClient from './RatesClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    slug: '/rates',
    title:
      locale === 'de'
        ? 'Surfcamp Preise — Pakete für Sri Lanka & Marokko (EUR)'
        : 'Surf Camp Rates — Packages for Sri Lanka & Morocco (EUR)',
    description:
      locale === 'de'
        ? 'Transparente Preise in EUR für alle Surfcamp-Pakete, Zimmerkategorien und Zusatz-Aktivitäten. Beach Camp, TS2, Soul Surfer und SurfStyle Marokko.'
        : 'Transparent EUR pricing for all surf camp packages, room types, and add-on activities. Beach Camp, TS2, Soul Surfer and SurfStyle Morocco.',
    image: '/rates.jpg',
    locale,
  });
}

export default async function RatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [{ name: 'Rates', slug: '/rates' }])}
      />
      <RatesClient />
    </>
  );
}
