import { setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';
import ContactClient from './ContactClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    slug: '/contact',
    title:
      locale === 'de'
        ? 'Kontakt — The Surfer Surfcamp Sri Lanka & Marokko'
        : 'Contact The Surfer — Surf Camp Sri Lanka & Morocco',
    description:
      locale === 'de'
        ? 'Schreib uns auf Deutsch oder Englisch. Buchungsanfragen, Fragen vor der Reise, oder uns in Weligama, Sri Lanka besuchen.'
        : 'Reach us in English or German. Book a camp, ask pre-trip questions, or visit us in Weligama, Sri Lanka.',
    image: '/contactus.jpg',
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(locale, [{ name: 'Contact', slug: '/contact' }])}
      />
      <ContactClient />
    </>
  );
}
