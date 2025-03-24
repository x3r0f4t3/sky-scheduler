
import { AviationStackResponse, AviationStackFlight } from '@/types/aviationStack';
import { Flight, SearchParams } from '@/types';

// Get the API key from environment variables
const API_KEY = import.meta.env.VITE_AVIATION_STACK_API_KEY;
const API_BASE_URL = 'https://api.aviationstack.com/v1';

// Function to search for flights
export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    // Format the date for the API
    const formattedDate = params.departDate.split('T')[0]; // YYYY-MM-DD format
    
    // Construct the API URL with query parameters
    const url = `${API_BASE_URL}/flights?access_key=${API_KEY}&dep_iata=${params.from}&arr_iata=${params.to}&flight_date=${formattedDate}`;
    
    console.log(`Searching flights with params:`, params);
    console.log(`API URL: ${url}`);
    
    // Make the API request
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data: AviationStackResponse = await response.json();
    console.log('API Response:', data);
    
    // Check if the data is valid
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid API response format');
    }
    
    // If no data found, return empty array
    if (data.data.length === 0) {
      return [];
    }
    
    // Transform API data to our app's Flight format
    return transformApiResponseToFlights(data.data, params);
    
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// Helper function to transform API response to our Flight format
const transformApiResponseToFlights = (
  apiFlights: AviationStackFlight[], 
  searchParams: SearchParams
): Flight[] => {
  return apiFlights
    .filter(flight => 
      // Filter out flights with incomplete data
      flight.flight_status && 
      flight.departure.scheduled && 
      flight.arrival.scheduled && 
      flight.airline.name
    )
    .map((flight, index) => {
      // Generate a unique ID (in a real app, the API would provide this)
      const id = `flight-${index}-${Date.now()}`;
      
      // Calculate a fake price based on distance and randomness
      const basePrice = 200; // Base price in USD
      const randomFactor = 0.7 + Math.random() * 0.6; // Random factor between 0.7 and 1.3
      const price = Math.round(basePrice * randomFactor * (1 + searchParams.passengers * 0.1));
      
      // Calculate duration based on scheduled times
      const departureTime = new Date(flight.departure.scheduled);
      const arrivalTime = new Date(flight.arrival.scheduled);
      const durationMs = arrivalTime.getTime() - departureTime.getTime();
      const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
      const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
      const durationFormatted = `${durationHours}h ${durationMinutes}m`;
      
      // Randomly assign number of stops
      const stops = Math.floor(Math.random() * 2); // 0 or 1 stops
      
      return {
        id,
        airline: {
          name: flight.airline.name,
          logo: `https://dummyimage.com/200x80/f1f1f1/000000.png&text=${encodeURIComponent(flight.airline.name)}`,
        },
        flight: {
          number: flight.flight.number || 'Unknown',
          iata: flight.flight.iata || 'Unknown',
        },
        departure: {
          airport: flight.departure.airport,
          terminal: flight.departure.terminal || undefined,
          gate: flight.departure.gate || undefined,
          scheduled: flight.departure.scheduled,
          timezone: flight.departure.timezone,
        },
        arrival: {
          airport: flight.arrival.airport,
          terminal: flight.arrival.terminal || undefined,
          gate: flight.arrival.gate || undefined,
          scheduled: flight.arrival.scheduled,
          timezone: flight.arrival.timezone,
        },
        price,
        duration: durationFormatted,
        stops,
      };
    });
};

// Function to get flight details by ID
export const getFlightById = async (id: string): Promise<Flight | null> => {
  // In a real app, we would make an API call here
  // For now, we'll return null since we don't have a real API endpoint for this
  return null;
};
