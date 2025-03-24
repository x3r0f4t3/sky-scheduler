
import { Flight, SearchParams } from '../types';

// This would be stored in .env in a real app
const apiKey = import.meta.env.VITE_AVIATION_STACK_API_KEY;

export const searchFlights = async (searchParams: SearchParams): Promise<Flight[]> => {
  try {
    // In a real app, this would fetch from the Aviation Stack API
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mockup flights data
    const mockFlights = generateMockFlights(searchParams);
    return mockFlights;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};

export const getFlightById = async (id: string): Promise<Flight | null> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo purposes, find the flight in our mock data
    const allMockFlights = generateMockFlights({
      from: 'Any',
      to: 'Any',
      departDate: new Date().toISOString(),
      passengers: 1,
      tripType: 'oneWay'
    });
    
    const flight = allMockFlights.find(f => f.id === id);
    return flight || null;
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
};

// Helper function to generate mock flights data
const generateMockFlights = (searchParams: SearchParams): Flight[] => {
  const airlines = [
    { name: 'Emirates', logo: 'emirates.png' },
    { name: 'Qatar Airways', logo: 'qatar.png' },
    { name: 'Singapore Airlines', logo: 'singapore.png' },
    { name: 'Lufthansa', logo: 'lufthansa.png' },
    { name: 'British Airways', logo: 'british.png' },
    { name: 'Air France', logo: 'airfrance.png' }
  ];
  
  const flights: Flight[] = [];
  
  for (let i = 0; i < 10; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = `${Math.floor(Math.random() * 9000) + 1000}`;
    
    // Generate departure time (between 6am and 9pm)
    const departHour = Math.floor(Math.random() * 15) + 6;
    const departMinute = Math.floor(Math.random() * 4) * 15;
    
    // Generate random flight duration between 1h30m and 4h30m
    const durationHours = Math.floor(Math.random() * 3) + 1;
    const durationMinutes = Math.floor(Math.random() * 4) * 15;
    const duration = `${durationHours}h ${durationMinutes}m`;
    
    // Calculate arrival time based on departure and duration
    const departTime = new Date(searchParams.departDate);
    departTime.setHours(departHour, departMinute, 0);
    
    const arrivalTime = new Date(departTime);
    arrivalTime.setHours(arrivalTime.getHours() + durationHours);
    arrivalTime.setMinutes(arrivalTime.getMinutes() + durationMinutes);
    
    // Generate random price between $100 and $1000
    const price = Math.floor(Math.random() * 900) + 100;
    
    // Random number of stops (0-2)
    const stops = Math.floor(Math.random() * 3);
    
    flights.push({
      id: `FLIGHT-${i+1}`,
      airline: { 
        name: airline.name,
        logo: airline.logo
      },
      flight: {
        number: flightNumber,
        iata: airline.name.substring(0, 2).toUpperCase() + flightNumber
      },
      departure: {
        airport: searchParams.from,
        terminal: `T${Math.floor(Math.random() * 5) + 1}`,
        gate: `G${Math.floor(Math.random() * 20) + 1}`,
        scheduled: departTime.toISOString(),
        timezone: 'GMT+1'
      },
      arrival: {
        airport: searchParams.to,
        terminal: `T${Math.floor(Math.random() * 5) + 1}`,
        gate: `G${Math.floor(Math.random() * 20) + 1}`,
        scheduled: arrivalTime.toISOString(),
        timezone: 'GMT+2'
      },
      price,
      duration,
      stops
    });
  }
  
  // Sort by price (lowest first)
  return flights.sort((a, b) => a.price - b.price);
};
