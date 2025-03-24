
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { getUserBookings } from '../utils/supabaseClient';
import { Booking } from '../types';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Check, Clock, Plane, User, X } from 'lucide-react';
import { format, parseISO, isAfter, addDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const { userId } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userBookings = await getUserBookings(userId);
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [userId]);
  
  // Separate bookings into upcoming and past
  const today = new Date();
  
  const upcomingBookings = bookings.filter(booking => {
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    return isAfter(bookingDate, today);
  });
  
  const pastBookings = bookings.filter(booking => {
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    return !isAfter(bookingDate, today);
  });
  
  return (
    <SignedIn>
      <div className="min-h-screen pt-24 pb-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
              <p className="text-muted-foreground">
                View and manage all your flight bookings in one place.
              </p>
            </div>
            
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="upcoming" className="text-base">
                  Upcoming Flights ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="text-base">
                  Past Flights ({pastBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {loading ? (
                  <BookingsSkeleton count={3} />
                ) : upcomingBookings.length === 0 ? (
                  <EmptyBookings
                    title="No Upcoming Flights"
                    description="You don't have any upcoming flights. Book a new flight to get started."
                    buttonText="Book a Flight"
                    buttonLink="/"
                  />
                ) : (
                  <div className="space-y-6">
                    {upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isUpcoming={true} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="past">
                {loading ? (
                  <BookingsSkeleton count={3} />
                ) : pastBookings.length === 0 ? (
                  <EmptyBookings
                    title="No Past Flights"
                    description="You don't have any past flight bookings."
                    buttonText="Book a Flight"
                    buttonLink="/"
                  />
                ) : (
                  <div className="space-y-6">
                    {pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SignedIn>
    
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  );
};

interface BookingCardProps {
  booking: Booking;
  isUpcoming: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, isUpcoming }) => {
  const departureDate = new Date(`${booking.date} ${booking.time}`);
  const formattedDate = format(departureDate, 'EEE, d MMM yyyy');
  
  // Calculate arrival time (add duration)
  const durationParts = booking.duration.match(/(\d+)h\s*(\d+)?m?/);
  const hours = durationParts ? parseInt(durationParts[1]) : 0;
  const minutes = durationParts && durationParts[2] ? parseInt(durationParts[2]) : 0;
  
  const arrivalTime = new Date(departureDate);
  arrivalTime.setHours(arrivalTime.getHours() + hours);
  arrivalTime.setMinutes(arrivalTime.getMinutes() + minutes);
  
  return (
    <div className="bg-background rounded-lg border border-border p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{booking.airline}</h3>
              <p className="text-sm text-muted-foreground">Booking #{booking.id.split('-')[1]}</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 md:mx-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-lg font-semibold">{booking.time}</p>
              <p className="text-sm">{booking.from}</p>
            </div>
            
            <div className="flex flex-col items-center mx-0 md:mx-4 mb-4 md:mb-0 w-full md:w-auto">
              <div className="text-xs text-muted-foreground">{booking.duration}</div>
              <div className="relative w-32 md:w-32 h-[1px] bg-muted my-2">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div className="text-xs text-muted-foreground">{formattedDate}</div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-lg font-semibold">{format(arrivalTime, 'HH:mm')}</p>
              <p className="text-sm">{booking.to}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isUpcoming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} mb-2`}>
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </div>
          <p className="text-sm text-muted-foreground mb-1 flex items-center">
            <User className="h-3 w-3 mr-1" />
            {booking.passengers} {booking.passengers === 1 ? 'passenger' : 'passengers'}
          </p>
          <p className="text-primary font-semibold">${booking.price}</p>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <p className="font-medium">Flight Date</p>
            <p className="text-muted-foreground">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
          <div>
            <p className="font-medium">Duration</p>
            <p className="text-muted-foreground">{booking.duration}</p>
          </div>
        </div>
        <div className="flex items-center">
          {booking.status === 'confirmed' ? (
            <Check className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <X className="h-4 w-4 text-red-500 mr-2" />
          )}
          <div>
            <p className="font-medium">Status</p>
            <p className={booking.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </p>
          </div>
        </div>
      </div>
      
      {isUpcoming && (
        <div className="mt-4 flex flex-col md:flex-row md:justify-end space-y-2 md:space-y-0 md:space-x-3">
          <Button variant="outline" size="sm">
            Manage Booking
          </Button>
          <Button size="sm">
            Check In
          </Button>
        </div>
      )}
    </div>
  );
};

interface EmptyBookingsProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const EmptyBookings: React.FC<EmptyBookingsProps> = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="bg-background rounded-lg border border-border p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Plane className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <Link to={buttonLink}>
          <Button>{buttonText}</Button>
        </Link>
      </div>
    </div>
  );
};

const BookingsSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-background rounded-lg border border-border p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between animate-pulse">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="w-24 h-5" />
                  <Skeleton className="w-16 h-3 mt-1" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 md:mx-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <Skeleton className="w-12 h-5 mx-auto md:mx-0" />
                  <Skeleton className="w-16 h-3 mt-1 mx-auto md:mx-0" />
                </div>
                
                <div className="flex flex-col items-center mx-0 md:mx-4 mb-4 md:mb-0 w-full md:w-auto">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-32 h-1 my-2" />
                  <Skeleton className="w-24 h-3" />
                </div>
                
                <div className="text-center md:text-right">
                  <Skeleton className="w-12 h-5 mx-auto md:ml-auto" />
                  <Skeleton className="w-16 h-3 mt-1 mx-auto md:ml-auto" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
              <Skeleton className="w-20 h-5 rounded-full mb-2" />
              <Skeleton className="w-24 h-3 mb-1" />
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
