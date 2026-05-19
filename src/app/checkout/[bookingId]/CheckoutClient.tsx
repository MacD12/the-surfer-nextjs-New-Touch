'use client';
import { useEffect, useState} from "react";

import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Globe
} from "lucide-react";
import { API_BASE_URL } from '@/lib/api';

const CheckoutPage = ({ bookingId }: { bookingId: string }) => {
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    confirmEmail: "",
    notes: "",
    agreed: false,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/bookings/${bookingId}`);
        setBooking(res.data);
        const traveller = res.data.travellerInfo[0] || {};
        setFormData(prev => ({
          ...prev,
          firstName: traveller.firstName || "",
          lastName: traveller.lastName || "",
          email: traveller.email || "",
          phone: traveller.phone || "",
          country: traveller.country || "",
        }));
      } catch (err) {
        console.error("Failed to fetch booking", err);
        setError("Unable to load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    
    if (!formData.confirmEmail.trim()) errors.confirmEmail = "Please confirm your email";
    else if (formData.email !== formData.confirmEmail) errors.confirmEmail = "Emails do not match";
    
    if (!formData.country.trim()) errors.country = "Country is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    
    if (!formData.agreed) errors.agreed = "You must agree to the terms and conditions";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      setError("Please fix the errors below");
      return;
    }

    setSubmitting(true);

    try {
      // Step 1: Get the payment session from your backend
      const response = await axios.post(
        `${API_BASE_URL}/bookings/generate-payment-session`,
        {
          amount: Math.round(booking.finalPrice * 0.25),
          currency: "EUR",
          orderId: booking._id,
          customerEmail: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
        }
      );

      const { sessionId, merchantId } = response.data;

      // Step 2: Configure and show MPGS payment
      if (window.Checkout) {
        window.Checkout.configure({
          session: {
            id: sessionId,
          },
          order: {
            amount: Math.round(booking.finalPrice * 0.25),
            currency: "EUR",
            description: `Booking deposit for ${booking.travellerInfo[0]?.firstName}`,
          },
          merchant: merchantId,
          interaction: {
            operation: "PURCHASE",
            merchant: {
              name: "The Surfer Weligama",
              address: {
                line1: "Weligama Beach",
                line2: "Sri Lanka",
              },
            },
            displayControl: {
              billingAddress: "HIDE",
            },
          },
        });

        // Handle payment completion
        window.Checkout.onPaymentCompleted = function(result) {
          console.log("Payment completed:", result);
          if (result.status === "SUCCESS") {
            router.push(`/booking-confirmation/${booking._id}`, {
              state: { paymentSuccess: true }
            });
          }
        };

        window.Checkout.onPaymentFailed = function(result) {
          console.error("Payment failed:", result);
          setError("Payment failed. Please try again or use a different payment method.");
          setSubmitting(false);
        };

        window.Checkout.showPaymentPage();
      } else {
        throw new Error("Payment system not available");
      }

    } catch (err) {
      console.error("Payment initialization failed:", err);
      setError(
        err.response?.data?.message || 
        "Failed to initialize payment. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="text-lg font-semibold text-slate-700">Loading your booking...</div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Not Found</h2>
          <p className="text-slate-600 mb-6">The booking you're looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const depositAmount = Math.round(booking.finalPrice * 0.25);
  const dueAmount = booking.finalPrice - depositAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Booking</h1>
          <p className="text-slate-600">Secure your surf camp experience with a 25% deposit</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Total Booking Amount:</span>
                  <span className="font-semibold text-slate-800">€{booking.finalPrice}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Deposit (25%):</span>
                  <span className="font-semibold text-blue-600">€{depositAmount}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600">Due on Arrival:</span>
                  <span className="font-semibold text-slate-800">€{dueAmount}</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <strong>Important:</strong> The remaining balance of €{dueAmount} must be paid upon arrival at the surf camp.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-800">Secure Payment</h3>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Mastercard Payment Gateway Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-soft p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Billing Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldErrors.firstName ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {fieldErrors.firstName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldErrors.lastName ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {fieldErrors.lastName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Email *
                  </label>
                  <input
                    name="confirmEmail"
                    type="email"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldErrors.confirmEmail ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Confirm your email"
                  />
                  {fieldErrors.confirmEmail && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.confirmEmail}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Country / Region *
                </label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    fieldErrors.country ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Enter your country"
                />
                {fieldErrors.country && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.country}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Street Address *
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    fieldErrors.address ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Enter your street address"
                />
                {fieldErrors.address && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City *
                  </label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldErrors.city ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Enter your city"
                  />
                  {fieldErrors.city && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      fieldErrors.postalCode ? 'border-red-300 bg-red-50' : 'border-slate-300'
                    }`}
                    placeholder="Enter postal code"
                  />
                  {fieldErrors.postalCode && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    fieldErrors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {fieldErrors.phone && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Any special requests or notes..."
                />
              </div>

              {/* Terms Agreement */}
              <div className="border-t border-slate-200 pt-4">
                <div className={`p-4 rounded-xl ${
                  fieldErrors.agreed ? 'bg-red-50 border border-red-200' : 'bg-slate-50'
                }`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <div className="text-sm text-slate-700">
                      I have read and agree to the website{" "}
                      <a
                        href="https://thesurferweligama.com/terms-and-conditions/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        terms and conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://thesurferweligama.com/privacy-policy/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                      >
                        privacy policy
                      </a>
                      . *
                    </div>
                  </label>
                  {fieldErrors.agreed && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.agreed}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl cursor-pointer font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay Deposit - €{depositAmount}
                  </>
                )}
              </button>

              <div className="text-center text-sm text-slate-500">
                <p>You'll be redirected to our secure payment gateway</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;