// src/app/[locale]/page.tsx
import { setRequestLocale, getMessages } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import JsonLd, { type StructuredData } from '@/components/seo/JsonLd';
import { homeSchemas } from '@/lib/structured-data';
import HomeClient from './HomeClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const titleByLocale: Record<string, string> = {
    en: 'Surf Camp Sri Lanka & Morocco — Winter Sun Surfing for Europeans',
    de: 'Surfcamp Sri Lanka & Marokko — Wintersonne & Wellen für Europäer',
  };
  const descByLocale: Record<string, string> = {
    en:
      'Europe’s favourite winter-sun surf camp. The Surfer in Weligama Sri Lanka and Tamraght Morocco — ISA-certified instructors, beachfront stay, all levels. 1600+ ⭐ 4.9 Google reviews. Book your surf trip from any EU hub.',
    de:
      'Das beliebteste Wintersonne-Surfcamp Europas. The Surfer in Weligama (Sri Lanka) und Tamraght (Marokko) — ISA-zertifizierte Surflehrer, Strandunterkunft, alle Levels. 1600+ ⭐ 4.9 Google-Bewertungen. Direkt aus jedem EU-Hub buchen.',
  };
  return buildPageMetadata({
    slug: '',
    title: titleByLocale[locale] || titleByLocale.en,
    description: descByLocale[locale] || descByLocale.en,
    image: '/banner.png',
    locale,
  });
}

// FAQPage schema — built from i18n messages so on-page FAQ and schema match.
type FAQItem = { question: string; answer: string };

async function buildFaqSchema(): Promise<StructuredData | null> {
  const messages = (await getMessages()) as Record<string, unknown>;
  const faq = messages.faq as { items?: FAQItem[] } | undefined;
  const items = faq?.items;
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question.replace(/^\d+\)\s*/, ''),
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const schemas: StructuredData[] = [...homeSchemas(locale)];
  const faq = await buildFaqSchema();
  if (faq) schemas.push(faq);

  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
      <HomeClient />
    </>
  );
}
