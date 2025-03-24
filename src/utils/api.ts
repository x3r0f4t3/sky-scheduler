
import { Flight, SearchParams } from '../types';

// Get API key from environment variable
const apiKey = import.meta.env.VITE_AVIATION_STACK_API_KEY;

export const searchFlights = async (searchParams: SearchParams): Promise<Flight[]> => {
  try {
    // Check if API key is available
    if (!apiKey) {
      console.error('Aviation Stack API key is missing');
      // Fall back to mock data if API key is not available
      return generateMockFlights(searchParams);
    }
    
    // Build the API URL with parameters
    const baseUrl = 'http://api.aviationstack.com/v1/flights';
    const queryParams = new URLSearchParams({
      access_key: apiKey,
      dep_iata: searchParams.from.split('(')[1]?.split(')')[0] || searchParams.from,
      arr_iata: searchParams.to.split('(')[1]?.split(')')[0] || searchParams.to,
      flight_date: new Date(searchParams.departDate).toISOString().split('T')[0],
      limit: '10'
    });
    
    // Make API request
    const response = await fetch(`${baseUrl}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API response to our Flight type
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((flight: any, index: number) => {
        // Calculate random price between $100 and $1000
        const price = Math.floor(Math.random() * 900) + 100;
        
        // Calculate flight duration
        const departure = new Date(flight.departure.scheduled || new Date());
        const arrival = new Date(flight.arrival.scheduled || new Date());
        const durationMs = arrival.getTime() - departure.getTime();
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const duration = `${durationHours}h ${durationMinutes}m`;
        
        return {
          id: `FLIGHT-${flight.flight.iata || index + 1}`,
          airline: {
            name: flight.airline.name || 'Unknown Airline',
            logo: flight.airline.name ? `${flight.airline.name.toLowerCase().replace(/\s/g, '')}.png` : undefined
          },
          flight: {
            number: flight.flight.number || `${index + 1000}`,
            iata: flight.flight.iata || `XX${index + 1000}`
          },
          departure: {
            airport: flight.departure.airport || searchParams.from,
            terminal: flight.departure.terminal,
            gate: flight.departure.gate,
            scheduled: flight.departure.scheduled || new Date().toISOString(),
            timezone: flight.departure.timezone || 'UTC'
          },
          arrival: {
            airport: flight.arrival.airport || searchParams.to,
            terminal: flight.arrival.terminal,
            gate: flight.arrival.gate,
            scheduled: flight.arrival.scheduled || new Date(new Date().getTime() + 3 * 60 * 60 * 1000).toISOString(),
            timezone: flight.arrival.timezone || 'UTC'
          },
          price,
          duration,
          stops: flight.flight.number ? (parseInt(flight.flight.number) % 3) : 0 // Random number of stops (0-2)
        };
      });
    }
    
    // If API response format is unexpected, fall back to mock data
    console.error('Unexpected API response format, using mock data instead');
    return generateMockFlights(searchParams);
  } catch (error) {
    console.error('Error fetching flights:', error);
    // Fall back to mock data in case of error
    return generateMockFlights(searchParams);
  }
};

export const getFlightById = async (id: string): Promise<Flight | null> => {
  try {
    // For demo purposes, find the flight in our mock data
    // In a real app, you would make an API call to get flight details
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
