
import { createClient } from '@supabase/supabase-js';
import { Booking, User } from '../types';

// In a real app, these would be in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  // This would be implemented to save to Supabase in a real app
  // For now, we'll mock the response
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    ...booking,
    id: `BOOKING-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString()
  };
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  // This would be implemented to fetch from Supabase in a real app
  // For now, we'll return mock data
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Generate some random past bookings
  const bookings: Booking[] = [];
  
  const airlines = [
    'Emirates',
    'Qatar Airways',
    'Singapore Airlines',
    'Lufthansa',
    'British Airways'
  ];
  
  const destinations = [
    { from: 'New York', to: 'London' },
    { from: 'Paris', to: 'Tokyo' },
    { from: 'Dubai', to: 'Sydney' },
    { from: 'Singapore', to: 'Los Angeles' },
    { from: 'Berlin', to: 'Mumbai' }
  ];
  
  // Create 5 random bookings
  for (let i = 0; i < 5; i++) {
    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 60)); // Random date in past 60 days
    
    const departureTime = new Date(bookingDate);
    departureTime.setHours(Math.floor(Math.random() * 24));
    departureTime.setMinutes(Math.floor(Math.random() * 4) * 15);
    
    bookings.push({
      id: `BOOKING-${i+1000}`,
      userId,
      flightId: `FLIGHT-${i+1000}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      price: Math.floor(Math.random() * 900) + 100,
      date: bookingDate.toISOString().split('T')[0],
      time: `${departureTime.getHours().toString().padStart(2, '0')}:${departureTime.getMinutes().toString().padStart(2, '0')}`,
      duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 4) * 15}m`,
      transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
      status: 'confirmed',
      from: dest.from,
      to: dest.to,
      passengers: Math.floor(Math.random() * 3) + 1,
      createdAt: new Date(bookingDate).toISOString()
    });
  }
  
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export default supabase;
