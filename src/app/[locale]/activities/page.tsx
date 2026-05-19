import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';
import ActivitiesClient from './ActivitiesClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    slug: '/activities',
    title:
      locale === 'de'
        ? 'Aktivitäten Sri Lanka — Yoga, Bootstouren, Schnorcheln & mehr'
        : 'Surf Camp Activities — Yoga, Boat Trips, Snorkelling & More',
    description:
      locale === 'de'
        ? 'Neben dem Surfen: Yoga, Bootstouren, Schnorcheln, Walbeobachtung, Kulturtouren. Alles vom The Surfer Beach Camp in Weligama buchbar — perfekt für europäische Reisende.'
        : 'Beyond surfing — yoga, boat trips, snorkelling, whale watching, cultural tours. All bookable from The Surfer Beach Camp in Weligama — built for European travellers.',
    image: '/activities.jpg',
    locale,
  });
}

export default async function ActivitiesPage({
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
          { name: 'Activities', slug: '/activities' },
        ])}
      />
      <ActivitiesClient />
    </>
  );
}
