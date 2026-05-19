import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';
import WaveCampClient from './WaveCampClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    slug: '/wave-camp',
    title:
      locale === 'de'
        ? 'Wave Surfcamp Sri Lanka — Weligama Bay'
        : 'Wave Surf Camp Sri Lanka — Weligama Bay',
    description:
      locale === 'de'
        ? 'Wave Surfcamp von The Surfer — geführte Lektionen, Premium-Unterkunft und die besten Wellen von Weligama Bay.'
        : 'Wave Surf Camp by The Surfer — guided lessons, premium accommodation, and the best breaks in Weligama Bay.',
    image: '/wave.jpg',
    locale,
  });
}

export default async function WaveCampPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: 'Sri Lanka', slug: '/srilanka' },
          { name: 'Wave Surf Camp', slug: '/wave-camp' },
        ])}
      />
      <WaveCampClient />
    </>
  );
}
