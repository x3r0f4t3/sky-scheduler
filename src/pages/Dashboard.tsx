
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/clerk-react';
import { Booking } from '@/types';
import { fetchUserBookings } from '@/utils/api';
import { Plane, Calendar, Clock, User, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && user) {
      const loadBookings = async () => {
        try {
          const userBookings = await fetchUserBookings(user.id);
          setBookings(userBookings);
        } catch (error) {
          console.error('Error fetching bookings:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadBookings();
    }
  }, [isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold mb-4">Loading user data...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Welcome, {user.firstName || 'Traveler'}!</h1>
        <p className="text-muted-foreground">Manage your bookings and account information</p>
      
        <Tabs defaultValue="bookings" className="mt-6">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings" className="mt-6">
            {isLoading ? (
              <div className="text-center py-10">
                <p>Loading your bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
                <Button variant="outline">Find a Flight</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        {booking.airline}
                      </CardTitle>
                      <CardDescription>
                        Booking ID: {booking.id.substring(0, 8)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="font-semibold text-lg">{booking.from}</div>
                          <div className="text-muted-foreground">→</div>
                          <div className="font-semibold text-lg">{booking.to}</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {booking.date}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {booking.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {booking.passengers} Passenger(s)
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            ${booking.price}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-medium">
                            {booking.status}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Booked: {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/10 justify-end">
                      <Button variant="ghost" size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Full Name</p>
                      <p>{user.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                      <p>{user.primaryEmailAddress?.emailAddress || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Update Profile</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
