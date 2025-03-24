
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flight } from '../types';
import { getFlightById } from '../utils/api';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  ArrowLeft, 
  ArrowRight, 
  BaggageClaim, 
  Calendar, 
  Clock, 
  CreditCard, 
  Plane, 
  Shield, 
  Ticket, 
  TimerOff, 
  User 
} from 'lucide-react';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const FlightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPassengers, setSelectedPassengers] = useState(1);
  
  useEffect(() => {
    const fetchFlightDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const flightData = await getFlightById(id);
        setFlight(flightData);
      } catch (error) {
        console.error('Error fetching flight details:', error);
        toast.error('Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlightDetails();
  }, [id]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleBookFlight = () => {
    if (!isSignedIn) {
      // Redirect to sign in if not logged in
      toast.error('Please sign in to book this flight');
      return;
    }
    
    if (!flight) return;
    
    // Navigate directly to payment page with flight details
    const bookingData = {
      flightId: flight.id,
      airline: flight.airline.name,
      from: flight.departure.airport,
      to: flight.arrival.airport,
      departureTime: flight.departure.scheduled,
      arrivalTime: flight.arrival.scheduled,
      price: flight.price,
      passengers: selectedPassengers,
      totalPrice: flight.price * selectedPassengers
    };
    
    navigate('/payment', { state: { bookingData } });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!flight) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Flight Not Found</h1>
          <p className="text-muted-foreground mb-6">The flight you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  // Format departure and arrival times
  const departureTime = flight ? format(parseISO(flight.departure.scheduled), 'h:mm a') : '';
  const arrivalTime = flight ? format(parseISO(flight.arrival.scheduled), 'h:mm a') : '';
  
  // Format departure and arrival dates
  const departureDate = flight ? format(parseISO(flight.departure.scheduled), 'EEEE, MMMM d, yyyy') : '';
  const arrivalDate = flight ? format(parseISO(flight.arrival.scheduled), 'EEEE, MMMM d, yyyy') : '';
  
  // Calculate cancellation fee (20% of the ticket price)
  const cancellationFee = flight ? (flight.price * 0.2).toFixed(2) : '0';
  
  // Calculate total price
  const totalPrice = flight ? (flight.price * selectedPassengers).toFixed(2) : '0';
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Results
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight details section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{flight.airline.name}</h1>
                    <p className="text-muted-foreground">Flight {flight.flight.iata}</p>
                  </div>
                </div>
                
                <div className="my-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    {/* Departure */}
                    <div className="text-center md:text-left mb-6 md:mb-0">
                      <p className="text-3xl font-semibold">{departureTime}</p>
                      <p className="text-lg font-medium">{flight.departure.airport}</p>
                      <p className="text-muted-foreground">{departureDate}</p>
                      {flight.departure.terminal && (
                        <p className="text-sm">Terminal {flight.departure.terminal}</p>
                      )}
                    </div>
                    
                    {/* Flight path visualization */}
                    <div className="flex flex-col items-center mx-4 w-full md:w-52 mb-6 md:mb-0">
                      <div className="text-sm text-muted-foreground text-center mb-2">{flight.duration}</div>
                      <div className="relative w-full mt-1 mb-1">
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-[1px] bg-muted"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-primary"></div>
                        <Plane className="relative mx-auto text-primary h-5 w-5 rotate-90" />
                      </div>
                      <div className="text-sm text-accent-foreground text-center mt-2">
                        {flight.stops === 0 ? "Nonstop" : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}
                      </div>
                    </div>
                    
                    {/* Arrival */}
                    <div className="text-center md:text-right">
                      <p className="text-3xl font-semibold">{arrivalTime}</p>
                      <p className="text-lg font-medium">{flight.arrival.airport}</p>
                      <p className="text-muted-foreground">{arrivalDate}</p>
                      {flight.arrival.terminal && (
                        <p className="text-sm">Terminal {flight.arrival.terminal}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-muted-foreground">{flight.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Ticket className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Flight Class</p>
                      <p className="text-muted-foreground">Economy</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BaggageClaim className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Baggage</p>
                      <p className="text-muted-foreground">1 x 23kg</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Flight details accordions */}
            <Accordion type="single" collapsible defaultValue="flight-details">
              <AccordionItem value="flight-details">
                <AccordionTrigger className="px-6 py-4 bg-background border border-border rounded-t-lg">
                  Flight Details
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-background border border-t-0 border-border rounded-b-lg">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">Departure</h3>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">{departureDate}</p>
                              <p className="text-sm text-muted-foreground">{departureTime}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Plane className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">{flight.departure.airport}</p>
                              {flight.departure.terminal && (
                                <p className="text-sm text-muted-foreground">Terminal {flight.departure.terminal}</p>
                              )}
                              {flight.departure.gate && (
                                <p className="text-sm text-muted-foreground">Gate {flight.departure.gate}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-2">Arrival</h3>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <Calendar className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">{arrivalDate}</p>
                              <p className="text-sm text-muted-foreground">{arrivalTime}</p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Plane className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
                            <div>
                              <p className="font-medium">{flight.arrival.airport}</p>
                              {flight.arrival.terminal && (
                                <p className="text-sm text-muted-foreground">Terminal {flight.arrival.terminal}</p>
                              )}
                              {flight.arrival.gate && (
                                <p className="text-sm text-muted-foreground">Gate {flight.arrival.gate}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold mb-2">Aircraft Information</h3>
                      <p className="text-muted-foreground">Boeing 737-800</p>
                      <p className="text-muted-foreground">Seat arrangement: 3-3</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="baggage">
                <AccordionTrigger className="px-6 py-4 bg-background border border-border rounded-t-lg mt-4">
                  Baggage Information
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-background border border-t-0 border-border rounded-b-lg">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Checked Baggage</h3>
                      <p className="text-muted-foreground">1 piece up to 23kg included in ticket price</p>
                      <p className="text-muted-foreground">Additional baggage: $50 per piece (up to 23kg)</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Cabin Baggage</h3>
                      <p className="text-muted-foreground">1 piece up to 8kg (55 x 35 x 25 cm)</p>
                      <p className="text-muted-foreground">1 personal item (laptop, handbag, etc.)</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="cancellation">
                <AccordionTrigger className="px-6 py-4 bg-background border border-border rounded-t-lg mt-4">
                  Cancellation Policy
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 bg-background border border-t-0 border-border rounded-b-lg">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <TimerOff className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <h3 className="font-semibold">Before 24 hours of departure</h3>
                        <p className="text-muted-foreground">Cancellation fee: ${cancellationFee}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <TimerOff className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <h3 className="font-semibold">Within 24 hours of departure</h3>
                        <p className="text-muted-foreground">Non-refundable</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-muted-foreground mr-2" />
                      <div>
                        <h3 className="font-semibold">Travel Insurance</h3>
                        <p className="text-muted-foreground">We recommend purchasing travel insurance for additional protection.</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          {/* Booking summary section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base fare</span>
                    <span>${flight.price}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Passengers</span>
                      <select
                        value={selectedPassengers}
                        onChange={(e) => setSelectedPassengers(parseInt(e.target.value))}
                        className="bg-background border border-input rounded-md px-2 py-1 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center mt-2">
                      <User className="h-4 w-4 text-muted-foreground mr-2" />
                      <span className="text-sm text-muted-foreground">
                        {selectedPassengers} x ${flight.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span>Included</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg text-primary">${totalPrice}</span>
                  </div>
                  
                  <SignedIn>
                    <Button 
                      className="w-full mt-4 btn-hover-effect"
                      onClick={handleBookFlight}
                    >
                      Book Flight
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignedIn>
                  
                  <SignedOut>
                    <div className="mt-4 space-y-3">
                      <Button 
                        className="w-full btn-hover-effect"
                        onClick={() => toast.error('Please sign in to book this flight')}
                      >
                        Book Flight
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Please sign in to book this flight
                      </p>
                    </div>
                  </SignedOut>
                  
                  <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Secure payment</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
                    <p className="text-sm">We accept all major credit cards</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
