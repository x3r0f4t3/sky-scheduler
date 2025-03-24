
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { processPayment } from '../utils/stripe';
import { createBooking } from '../utils/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Lock, 
  Plane
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'confirmation'>('details');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get booking data from location state
  const bookingData = location.state?.bookingData;
  
  // If there's no booking data, redirect to home
  React.useEffect(() => {
    if (!bookingData) {
      navigate('/');
    }
  }, [bookingData, navigate]);
  
  // Handle payment form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces after every 4 digits
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setPaymentData({
        ...paymentData,
        [name]: formatted
      });
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      let formatted = cleaned;
      
      if (cleaned.length > 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      
      setPaymentData({
        ...paymentData,
        [name]: formatted
      });
      return;
    }
    
    // Format CVV (only numbers, max 3 digits)
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 3);
      
      setPaymentData({
        ...paymentData,
        [name]: formatted
      });
      return;
    }
    
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };
  
  // Format departure and arrival times
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // Handle payment submission
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      toast.error('Please enter a valid card number');
      return;
    }
    
    if (!paymentData.cardHolder) {
      toast.error('Please enter the cardholder name');
      return;
    }
    
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      toast.error('Please enter a valid expiry date');
      return;
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }
    
    try {
      setIsProcessing(true);
      setPaymentStep('processing');
      
      // Process payment through Stripe
      const paymentResult = await processPayment(
        'pm_mock_payment_method', 
        bookingData.totalPrice
      );
      
      if (!paymentResult.success) {
        throw new Error('Payment failed');
      }
      
      // Save booking to database
      if (userId) {
        const booking = await createBooking({
          userId,
          flightId: bookingData.flightId,
          airline: bookingData.airline,
          price: bookingData.totalPrice,
          date: formatDate(bookingData.departureTime),
          time: formatTime(bookingData.departureTime),
          duration: '2h 30m', // This would come from flight data in a real app
          transactionId: paymentResult.transactionId,
          status: 'confirmed',
          from: bookingData.from,
          to: bookingData.to,
          passengers: bookingData.passengers
        });
        
        setBookingDetails({
          ...booking,
          transactionId: paymentResult.transactionId
        });
      }
      
      // Update UI to confirmation state
      setPaymentStep('confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setPaymentStep('details');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle back button
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // Handle continue to dashboard
  const handleContinue = () => {
    navigate('/dashboard');
  };
  
  if (!bookingData) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Payment Process Steps */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentStep === 'details' ? 'bg-primary text-white' : 'bg-primary/20 text-primary'}`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-sm mt-2">Payment Details</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${paymentStep === 'details' ? 'bg-muted' : 'bg-primary/60'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentStep === 'processing' ? 'bg-primary text-white' : paymentStep === 'confirmation' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Lock className="h-5 w-5" />
              </div>
              <span className="text-sm mt-2">Processing</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${paymentStep === 'confirmation' ? 'bg-primary/60' : 'bg-muted'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentStep === 'confirmation' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                <Check className="h-5 w-5" />
              </div>
              <span className="text-sm mt-2">Confirmation</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {paymentStep === 'details' && (
            <>
              <div className="bg-background rounded-lg border border-border p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Plane className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Flight Summary</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Airline</p>
                    <p className="font-medium">{bookingData.airline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Flight</p>
                    <p className="font-medium">{bookingData.flightId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-medium">{bookingData.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-medium">{bookingData.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="font-medium">
                      {formatDate(bookingData.departureTime)} at {formatTime(bookingData.departureTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="font-medium">
                      {formatDate(bookingData.arrivalTime)} at {formatTime(bookingData.arrivalTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Passengers</p>
                    <p className="font-medium">{bookingData.passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="font-bold text-primary">${bookingData.totalPrice}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-lg border border-border p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-primary mr-2" />
                  <h2 className="text-xl font-semibold">Payment Details</h2>
                </div>
                
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        value={paymentData.cardNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardHolder">Cardholder Name</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="John Doe"
                        value={paymentData.cardHolder}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${bookingData.price} x {bookingData.passengers}</span>
                    </div>
                    
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Taxes & Fees</span>
                      <span>Included</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${bookingData.totalPrice}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button 
                      type="submit" 
                      className="w-full btn-hover-effect"
                    >
                      Pay ${bookingData.totalPrice}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleGoBack}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </Button>
                    <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4 mr-1" />
                      <span>Secure payment powered by Stripe</span>
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
          
          {paymentStep === 'processing' && (
            <div className="bg-background rounded-lg border border-border p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary border-l-transparent animate-spin mb-4"></div>
                <h2 className="text-2xl font-semibold mb-2">Processing Payment</h2>
                <p className="text-muted-foreground">
                  Please wait while we process your payment. This may take a few moments.
                </p>
              </div>
            </div>
          )}
          
          {paymentStep === 'confirmation' && bookingDetails && (
            <div className="bg-background rounded-lg border border-border p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
                <p className="text-muted-foreground">
                  Your payment was successful and your booking has been confirmed.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Booking Reference</p>
                        <p className="font-medium">{bookingDetails.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction ID</p>
                        <p className="font-medium">{bookingDetails.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Airline</p>
                        <p className="font-medium">{bookingDetails.airline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium text-green-500">Confirmed</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flight Details</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">From</p>
                        <p className="font-medium">{bookingDetails.from}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">To</p>
                        <p className="font-medium">{bookingDetails.to}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{bookingDetails.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{bookingDetails.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Passengers</p>
                        <p className="font-medium">{bookingDetails.passengers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="font-medium">${bookingDetails.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <p className="text-sm text-muted-foreground mb-4 text-center">
                    An email with your booking confirmation has been sent to your registered email address.
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Button 
                      className="w-full btn-hover-effect"
                      onClick={handleContinue}
                    >
                      Go to My Bookings
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Return to Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
