'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Waves, MapPin, Heart, Info } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-compat';
import { useLocale } from 'next-intl';

/**
 * Source paragraphs (from i18n) come in this order:
 *   [0] intro line
 *   [1] "Beach Camp: ..." description
 *   [2] "TS2 Camp: ..." description
 *   [3] "Soul Surfer: ..." description (independent camp)
 *   [4] shared note — where Beach Camp + TS2 activities happen
 *   [5] shared note — transport compensation between Beach Camp + TS2
 *
 * We strip the "<Camp name>: " prefix so the camp name becomes the card title
 * and the rest becomes the card body — works for both EN and DE because both
 * locales use the same colon-prefix structure.
 */
function splitTitleAndBody(text: string): { title: string; body: string } {
  const match = text.match(/^([^:]+):\s*(.+)$/s);
  if (match) {
    return { title: match[1].trim(), body: match[2].trim() };
  }
  return { title: '', body: text };
}

type CampCardProps = {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  body: string;
  index: number;
};

const CampCard = ({ icon: Icon, title, body, index }: CampCardProps) => (
  <motion.div
    className="group relative h-full flex flex-col bg-white rounded-2xl shadow-md ring-1 ring-black/5 p-6 sm:p-7 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl hover:ring-[#0a67b3]/25"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: index * 0.1, ease: 'easeOut' }}
    viewport={{ once: true, amount: 0.3 }}
  >
    {/* Left-edge brand accent bar */}
    <span
      aria-hidden="true"
      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0a67b3] via-cyan-400 to-[#0a67b3]"
    />

    <div className="flex items-center gap-3 mb-4">
      <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-[#0a67b3] to-[#0891b2] shadow-md shadow-[#0a67b3]/25 group-hover:scale-110 transition-transform duration-300 ease-out">
        <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
        {title}
      </h3>
    </div>

    <p className="text-sm md:text-[15px] text-gray-600 leading-[1.75]">
      {body}
    </p>
  </motion.div>
);

const Difference = () => {
  const { t } = useTranslation();
  const locale = useLocale();

  const eyebrow = t('ts2Diff.eyebrow');
  const heading = t('ts2Diff.heading');
  const cta = t('ts2Diff.cta');
  const paragraphs =
    (t('ts2Diff.paragraphs', { returnObjects: true }) as string[]) || [];
  const aria = t('ts2Diff.aria', { returnObjects: true }) as {
    section?: string;
    cta?: string;
  };

  // The intro (paragraphs[0]) may hold a lead line + extra paragraphs,
  // separated by blank lines. Split so each renders as its own <p>.
  const introParts = (paragraphs[0] || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  const beach = splitTitleAndBody(paragraphs[1] || '');
  const ts2 = splitTitleAndBody(paragraphs[2] || '');
  const soulSurfer = splitTitleAndBody(paragraphs[3] || '');
  const sharedNotes = paragraphs.slice(4).filter(Boolean);

  return (
    <section
      className="relative w-full"
      aria-label={aria?.section}
    >
      {/* Heading */}
      <motion.div
        className="flex flex-col items-center mb-10 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <span className="inline-block text-[11px] uppercase tracking-[0.3em] font-semibold text-[#0a67b3] mb-3">
          {eyebrow}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          {heading}
        </h2>
        <motion.div
          className="mt-4 mb-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#0a67b3] via-cyan-400 to-[#0a67b3] origin-center"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        />
        {introParts.length > 0 && (
          <div className="space-y-3">
            {introParts.map((part, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'text-base md:text-lg font-semibold text-gray-800 leading-relaxed'
                    : 'text-sm md:text-base text-gray-600 leading-relaxed'
                }
              >
                {part}
              </p>
            ))}
          </div>
        )}
      </motion.div>

      {/* Comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto mb-8">
        <CampCard icon={Waves} title={beach.title} body={beach.body} index={0} />
        <CampCard icon={MapPin} title={ts2.title} body={ts2.body} index={1} />
        {soulSurfer.body && (
          <CampCard icon={Heart} title={soulSurfer.title} body={soulSurfer.body} index={2} />
        )}
      </div>

      {/* Shared notes panel */}
      {sharedNotes.length > 0 && (
        <motion.div
          className="max-w-4xl mx-auto bg-white/70 backdrop-blur-sm rounded-2xl ring-1 ring-[#0a67b3]/10 p-5 sm:p-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0a67b3]/10">
              <Info className="w-4 h-4 text-[#0a67b3]" strokeWidth={2} />
            </div>
            <div className="space-y-2 text-sm md:text-[15px] text-gray-700 leading-[1.7]">
              {sharedNotes.map((note, i) => (
                <p key={i}>{note}</p>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <a
          href={`/${locale}/rates`}
          aria-label={aria?.cta || cta}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-[#0a67b3] to-[#0891b2] text-white text-sm font-semibold shadow-lg shadow-[#0a67b3]/25 hover:shadow-xl hover:shadow-[#0a67b3]/40 hover:scale-105 transition-all duration-300"
        >
          {cta}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </motion.div>
    </section>
  );
};

export default Difference;
