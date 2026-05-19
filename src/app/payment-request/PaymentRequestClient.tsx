'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Package, 
  Bed, 
  Plus, 
  CreditCard, 
  ArrowRight,
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { API_BASE_URL } from '@/lib/api';

const PaymentRequest = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Booking not found", err);
        setError("Unable to load booking details. The booking may have expired or been cancelled.");
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    } else {
      setError("No booking ID provided. Please check your payment link.");
      setLoading(false);
      setNotFound(true);
    }
  }, [bookingId]);

  const handleSubmitPayment = () => {
    router.push(`/checkout/${booking._id}`);
  };

  //dateRange = Oct 22, 2025 - Oct 24, 2025
  const formatDateRange = (dateRange) => {
    if (!dateRange) return "Not specified";
    const [start, end] = dateRange.split(" - ");
    return `${start} to ${end}`;
  };

  const calculateNights = (dateRange) => {
    if (!dateRange) return 0;
    const [start, end] = dateRange.split(" - ");
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-lg font-semibold text-slate-700">Loading your booking...</div>
          <div className="text-sm text-slate-500 mt-2">Preparing your payment details</div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Not Found</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const {
    travellerInfo,
    selectedCamp,
    dateRange,
    selectedPackages,
    selectedRooms,
    addons,
    finalPrice,
    totalPrice,
    discount,
    note,
  } = booking;

  const traveller = travellerInfo[0] || {};
  const nights = calculateNights(dateRange);
  const depositAmount = Math.round(finalPrice * 0.25);
  const dueAmount = finalPrice - depositAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200 inline-block mb-4">
            <CreditCard className="w-12 h-12 text-blue-600 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Booking Payment</h1>
          <p className="text-slate-600 text-lg">Secure your spot with a 25% deposit</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Guest Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InfoItem 
                    icon={<User className="w-4 h-4" />}
                    label="Full Name"
                    value={`${traveller.firstName || ''} ${traveller.lastName || ''}`.trim() || "Not provided"}
                  />
                  <InfoItem 
                    icon={<Mail className="w-4 h-4" />}
                    label="Email"
                    value={traveller.email || "Not provided"}
                  />
                  <InfoItem 
                    icon={<MapPin className="w-4 h-4" />}
                    label="Camp Location"
                    value={selectedCamp || "Not specified"}
                  />
                </div>
                <div className="space-y-4">
                  <InfoItem 
                    icon={<Calendar className="w-4 h-4" />}
                    label="Stay Duration"
                    value={`${nights} night${nights !== 1 ? 's' : ''}`}
                  />
                  <InfoItem 
                    icon={<Calendar className="w-4 h-4" />}
                    label="Dates"
                    value={formatDateRange(dateRange)}
                  />
                  {traveller.phone && (
                    <InfoItem 
                      icon={<Phone className="w-4 h-4" />}
                      label="Phone"
                      value={traveller.phone}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Booking Details
              </h2>

              <div className="space-y-6">
                {/* Packages */}
                {selectedPackages && selectedPackages.length > 0 && (
                  <DetailSection
                    icon={<Package className="w-4 h-4" />}
                    title="Surf Packages"
                    items={selectedPackages}
                  />
                )}

                {/* Rooms */}
                {selectedRooms && selectedRooms.length > 0 && (
                  <DetailSection
                    icon={<Bed className="w-4 h-4" />}
                    title="Accommodation"
                    items={selectedRooms}
                  />
                )}

                {note && (
                  <div className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Note
                    </h3>
                    <p className="text-slate-700">{note}</p>
                  </div>
                )}

                {/* Addons */}
                {addons && addons.length > 0 && (
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-green-600" />
                      Additional Services
                    </h3>
                    <div className="space-y-2">
                      {addons.map((addon, index) => (
                        <div key={index} className="flex justify-between items-center py-2">
                          <span className="text-slate-700">{addon.title}</span>
                          {addon.price && (
                            <span className="font-semibold text-slate-800">€{addon.price}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Summary & Action */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Total Amount:</span>
                  <span className="font-semibold text-slate-800">€{totalPrice}</span>
                </div>
                
                {discount && discount > 0 && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Discount ({discount}%):</span>
                    <span className="font-semibold text-green-600">-€{totalPrice - finalPrice}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-800 font-semibold">Final Amount:</span>
                    <span className="text-lg font-bold text-blue-600">€{finalPrice}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <div className="text-sm text-blue-800 space-y-2">
                    <div className="flex justify-between">
                      <span>Deposit (25%):</span>
                      <span className="font-semibold">€{depositAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due on Arrival:</span>
                      <span className="font-semibold">€{dueAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-slate-800">Secure Payment</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure payment gateway</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleSubmitPayment}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white cursor-pointer py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <CreditCard className="w-5 h-5" />
              Pay Deposit - €{depositAmount}
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Help Text */}
            <div className="text-center text-sm text-slate-500">
              <p>You'll be redirected to our secure checkout page</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-amber-800">
              <h3 className="font-semibold mb-2">Important Payment Information</h3>
              <ul className="text-sm space-y-1">
                <li>• Your booking is reserved once the 25% deposit is paid</li>
                <li>• The remaining balance of €{dueAmount} is due upon arrival</li>
                <li>• You'll receive a confirmation email after successful payment</li>
                <li>• Free cancellation up to 30 days before check-in</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-slate-500 mb-1">{label}</div>
      <div className="text-slate-800">{value}</div>
    </div>
  </div>
);

const DetailSection = ({ icon, title, items }) => (
  <div className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
    <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-slate-700">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <span>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

// Add missing Phone icon component
const Phone = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default PaymentRequest;