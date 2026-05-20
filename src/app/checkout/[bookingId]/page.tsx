// checkout/[bookingId]/page.tsx — server wrapper that awaits params,
// then renders a client-only checkout (so localStorage / Mastercard SDK
// initializers don't run during SSR).
'use client';
import { use } from 'react';
import dynamic from 'next/dynamic';
import BookingStepSkeleton from '@/components/booking_engine/BookingStepSkeleton';

const CheckoutClient = dynamic(() => import('./CheckoutClient'), {
  ssr: false,
  loading: () => <BookingStepSkeleton />,
});

export default function Page({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  return <CheckoutClient bookingId={bookingId} />;
}
