import { getMessages, setRequestLocale } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { breadcrumbSchema } from '@/lib/structured-data';
import FaqClient from './FaqClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return buildPageMetadata({
    slug: '/faq',
    title:
      locale === 'de'
        ? 'Surfcamp FAQ — Fragen vor der Buchung'
        : 'Surf Camp FAQ — Questions Before You Book',
    description:
      locale === 'de'
        ? 'Antworten auf die häufigsten Fragen unserer europäischen Gäste — Reisezeit, Visa, Anfänger-Surfen, Unterkunft, Stornierung. The Surfer Sri Lanka & Marokko.'
        : 'Answers to the most common questions from our European guests — best time to visit, visas, beginner surf, accommodation, cancellation. The Surfer Sri Lanka & Morocco.',
    image: '/faq.jpg',
    locale,
  });
}

type FaqItem = { question: string; answer: string };

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = (await getMessages()) as Record<string, unknown>;
  const faq = messages.faq as { items?: FaqItem[] } | undefined;
  const items = Array.isArray(faq?.items) ? faq.items : [];

  const schemas: StructuredData[] = [
    breadcrumbSchema(locale, [{ name: 'FAQ', slug: '/faq' }]),
  ];
  if (items.length > 0) {
    schemas.unshift({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question.replace(/^\d+\)\s*/, ''),
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
      <FaqClient />
    </>
  );
}
