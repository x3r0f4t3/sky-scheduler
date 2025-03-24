
export interface Flight {
  id: string;
  airline: {
    name: string;
    logo?: string;
  };
  flight: {
    number: string;
    iata: string;
  };
  departure: {
    airport: string;
    terminal?: string;
    gate?: string;
    scheduled: string;
    timezone: string;
  };
  arrival: {
    airport: string;
    terminal?: string;
    gate?: string;
    scheduled: string;
    timezone: string;
  };
  price: number;
  duration: string;
  stops: number;
}

export interface SearchParams {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  airline: string;
  price: number;
  date: string;
  time: string;
  duration: string;
  transactionId: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  from: string;
  to: string;
  passengers: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  timestamp: string;
}
