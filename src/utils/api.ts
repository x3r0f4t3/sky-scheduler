
import { AviationStackResponse } from '@/types/aviationStack';
import { Flight, SearchParams, Booking, PaymentResponse, User } from '@/types';
import { searchFlights as searchAviationStackFlights } from './aviationStackApi';
import { supabase } from './supabaseClient';

// Search flights using the Aviation Stack API
export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    return await searchAviationStackFlights(params);
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// Get a specific flight by ID
export const getFlightById = async (id: string): Promise<Flight | null> => {
  try {
    // In a real app, we'd fetch this from an API or database
    // For now, we'll simulate this by fetching from Supabase
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Flight;
  } catch (error) {
    console.error('Error fetching flight:', error);
    return null;
  }
};

// Process a payment
export const processPayment = async (
  userId: string,
  flightId: string,
  amount: number
): Promise<PaymentResponse> => {
  try {
    // In a real app, this would call a backend API that interacts with Stripe
    // For now, we'll simulate a successful payment
    
    const transactionId = `txn_${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      success: true,
      transactionId,
      amount,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

// Create a booking
export const createBooking = async (
  userId: string,
  flightId: string,
  flight: Flight,
  transactionId: string,
  passengers: number
): Promise<Booking> => {
  try {
    const booking = {
      id: `bkg_${Math.random().toString(36).substring(2, 15)}`,
      userId,
      flightId,
      airline: flight.airline.name,
      price: flight.price,
      date: new Date(flight.departure.scheduled).toLocaleDateString(),
      time: new Date(flight.departure.scheduled).toLocaleTimeString(),
      duration: flight.duration,
      transactionId,
      status: 'confirmed' as const,
      from: flight.departure.airport,
      to: flight.arrival.airport,
      passengers,
      createdAt: new Date().toISOString()
    };
    
    // In a real app, we'd save this to a database
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select();
      
    if (error) throw error;
    
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Fetch user's bookings
export const fetchUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    // In a real app, we'd fetch this from a database
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
      
    if (error) throw error;
    
    return data as Booking[];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};
