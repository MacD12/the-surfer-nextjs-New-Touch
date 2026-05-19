'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package as PackageIcon, BedDouble, Waves } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-compat';

type ColKey = 'moderateSurf' | 'surfAndYoga' | 'fullSurf';

type FeatureRow = {
  name: string;
  moderateSurf?: string;
  surfAndYoga?: string;
  fullSurf?: string;
};

type AccommodationRow = {
  name: string;
  note?: string;
  moderateSurf: string;
  surfAndYoga: string;
  fullSurf: string;
};

const Package = () => {
  const { t } = useTranslation();

  const cols: { key: ColKey; label: string }[] = [
    { key: 'moderateSurf', label: t('packageTable.headers.moderateSurf') },
    { key: 'surfAndYoga', label: t('packageTable.headers.surfAndYoga') },
    { key: 'fullSurf', label: t('packageTable.headers.fullSurf') },
  ];

  const featureRows: FeatureRow[] = [
    {
      name: t('packageTable.rows.surfLessons.name'),
      moderateSurf: t('packageTable.rows.surfLessons.moderateSurf'),
      surfAndYoga: t('packageTable.rows.surfLessons.surfAndYoga'),
      fullSurf: t('packageTable.rows.surfLessons.fullSurf'),
    },
    {
      name: t('packageTable.rows.yoga.name'),
      moderateSurf: t('packageTable.rows.yoga.moderateSurf'),
      surfAndYoga: t('packageTable.rows.yoga.surfAndYoga'),
      fullSurf: t('packageTable.rows.yoga.fullSurf'),
    },
    {
      name: t('packageTable.rows.nights.name'),
      moderateSurf: '✓',
      surfAndYoga: '✓',
      fullSurf: '✓',
    },
    {
      name: t('packageTable.rows.breakfast.name'),
      moderateSurf: '✓',
      surfAndYoga: '✓',
      fullSurf: '✓',
    },
    {
      name: t('packageTable.rows.dinner.name'),
      moderateSurf: '✓',
      surfAndYoga: '✓',
      fullSurf: '✓',
    },
    {
      name: t('packageTable.rows.surfTheory.name'),
      moderateSurf: '✓',
      surfAndYoga: '✓',
      fullSurf: '✓',
    },
    {
      name: t('packageTable.rows.videoAnalysis.name'),
      moderateSurf: '✓',
      surfAndYoga: '✓',
      fullSurf: '✓',
    },
    {
      name: t('packageTable.rows.dailySocial.name'),
      moderateSurf: '✓',
      surfAndYoga: '✓',
      fullSurf: '✓',
    },
  ];

  const accommodationRows: AccommodationRow[] = [
    {
      name: t('packageTable.accommodation.dorm.name'),
      note: t('packageTable.accommodation.dorm.note'),
      moderateSurf: '290€ / 41.43€',
      surfAndYoga: '350€ / 50.0€',
      fullSurf: '390€ / 55.71€',
    },
    {
      name: t('packageTable.accommodation.single.name'),
      note: t('packageTable.accommodation.single.note'),
      moderateSurf: '390€ / 55.71€',
      surfAndYoga: '450€ / 64.29€',
      fullSurf: '490€ / 70.0€',
    },
    {
      name: t('packageTable.accommodation.doubleTwin.name'),
      note: t('packageTable.accommodation.doubleTwin.note'),
      moderateSurf: '290€ / 41.43€',
      surfAndYoga: '350€ / 50.0€',
      fullSurf: '390€ / 55.71€',
    },
    {
      name: t('packageTable.accommodation.triple.name'),
      note: t('packageTable.accommodation.triple.note'),
      moderateSurf: '290€ / 41.43€',
      surfAndYoga: '350€ / 50.0€',
      fullSurf: '390€ / 55.71€',
    },
  ];

  const renderValue = (val?: string) => {
    if (!val) return <span className="text-gray-300">—</span>;
    if (val === '✓') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 ring-1 ring-emerald-200 text-emerald-700">
          <Check className="w-3.5 h-3.5" strokeWidth={2.75} />
        </span>
      );
    }
    return <span className="text-sm font-medium text-gray-700">{val}</span>;
  };

  const renderPrice = (val: string) => {
    if (!val) return <span className="text-gray-300">—</span>;
    const [weekly, daily] = val.split('/').map((s) => s.trim());
    return (
      <div className="flex flex-col items-center">
        <span className="font-[montserrat] text-base font-bold tracking-tight text-gray-900 tabular-nums">
          {weekly}
        </span>
        {daily && (
          <span className="text-[10px] text-gray-500 tabular-nums mt-0.5">
            {daily} <span className="text-gray-400">/day</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <section
      id="packages"
      className="relative scroll-mt-20 py-14 sm:py-16 md:py-20 bg-gradient-to-b from-cyan-50/30 via-white to-cyan-50/20 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          className="flex flex-col items-center mb-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] font-bold text-[#0a67b3]">
            <PackageIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
            {t('packageTable.title')}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="font-[montserrat] text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-center text-gray-900 leading-[1.05]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
        >
          {t('packageTable.subtitle')}
        </motion.h2>

        {/* Accent bar */}
        <motion.div
          className="mt-5 mb-10 sm:mb-12 flex justify-center"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <span className="block h-[3px] w-16 sm:w-20 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.5)]" />
        </motion.div>

        {/* Inclusions table */}
        <motion.div
          className="rounded-3xl bg-white ring-1 ring-gray-100 shadow-lg overflow-hidden mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="px-5 sm:px-6 py-5 bg-gradient-to-br from-cyan-50/60 via-white to-white border-b border-gray-100 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0a67b3] to-[#0891b2] shadow-md shadow-cyan-500/25">
              <Waves className="w-4 h-4 text-white" strokeWidth={2.25} />
            </span>
            <div>
              <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-cyan-700">
                01 · What's included
              </span>
              <h3 className="font-[montserrat] text-base sm:text-lg font-bold tracking-tight text-gray-800 leading-tight">
                Surf, yoga, food & vibes
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-br from-gray-50 to-white">
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-gray-50 to-white px-5 sm:px-6 py-4 text-left text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 min-w-[180px]">
                    Inclusion
                  </th>
                  {cols.map((c, i) => (
                    <th
                      key={c.key}
                      className={`px-4 sm:px-6 py-4 text-center text-[10px] font-bold tracking-[0.18em] uppercase ${
                        i === 1
                          ? 'text-cyan-700 bg-cyan-50/50'
                          : 'text-gray-500'
                      }`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`group transition-colors duration-200 ${
                      i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                    } hover:bg-cyan-50/30`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-5 sm:px-6 py-3.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {row.name}
                    </td>
                    {cols.map((c, idx) => (
                      <td
                        key={c.key}
                        className={`px-4 sm:px-6 py-3.5 text-center ${
                          idx === 1 ? 'bg-cyan-50/30' : ''
                        }`}
                      >
                        {renderValue(row[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Accommodation pricing */}
        <motion.div
          className="rounded-3xl bg-white ring-1 ring-gray-100 shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.15 }}
        >
          <div className="px-5 sm:px-6 py-5 bg-gradient-to-br from-cyan-50/60 via-white to-white border-b border-gray-100 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0a67b3] to-[#0891b2] shadow-md shadow-cyan-500/25">
              <BedDouble className="w-4 h-4 text-white" strokeWidth={2.25} />
            </span>
            <div>
              <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-cyan-700">
                02 · Rates per person
              </span>
              <h3 className="font-[montserrat] text-base sm:text-lg font-bold tracking-tight text-gray-800 leading-tight">
                Weekly · daily pricing
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-br from-gray-50 to-white">
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-gray-50 to-white px-5 sm:px-6 py-4 text-left text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 min-w-[200px]">
                    Room
                  </th>
                  {cols.map((c, i) => (
                    <th
                      key={c.key}
                      className={`px-4 sm:px-6 py-4 text-center text-[10px] font-bold tracking-[0.18em] uppercase ${
                        i === 1
                          ? 'text-cyan-700 bg-cyan-50/50'
                          : 'text-gray-500'
                      }`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accommodationRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`group transition-colors duration-200 ${
                      i % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                    } hover:bg-cyan-50/30`}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-5 sm:px-6 py-4 align-top">
                      <div className="font-[montserrat] text-sm sm:text-base font-bold tracking-tight text-gray-900 leading-tight">
                        {row.name}
                      </div>
                      {row.note && (
                        <div className="text-[11px] text-gray-500 mt-0.5">{row.note}</div>
                      )}
                    </td>
                    {cols.map((c, idx) => (
                      <td
                        key={c.key}
                        className={`px-4 sm:px-6 py-4 text-center ${
                          idx === 1 ? 'bg-cyan-50/30' : ''
                        }`}
                      >
                        {renderPrice(row[c.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/40 text-[11px] text-gray-500 text-center">
            Weekly rate <span className="text-gray-700 font-semibold">€</span> · daily rate <span className="text-gray-700 font-semibold">€/day</span>. Prices are per person and exclude airport transfers and peak-season surcharges.
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Package;
