
import React from 'react';
import { Link } from 'react-router-dom';
import { Flight } from '../types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';
import { ArrowRight, Clock, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  className?: string;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, className }) => {
  // Format departure and arrival times
  const departureTime = format(parseISO(flight.departure.scheduled), 'h:mm a');
  const arrivalTime = format(parseISO(flight.arrival.scheduled), 'h:mm a');
  
  // Format departure and arrival dates
  const departureDate = format(parseISO(flight.departure.scheduled), 'MMM d, yyyy');
  const arrivalDate = format(parseISO(flight.arrival.scheduled), 'MMM d, yyyy');
  
  // Display stops
  const stopsDisplay = flight.stops === 0 
    ? "Nonstop" 
    : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`;

  return (
    <div 
      className={cn(
        "bg-background rounded-lg border border-border p-4 hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mr-3">
            <Plane className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{flight.airline.name}</h3>
            <p className="text-sm text-muted-foreground">{flight.flight.iata}</p>
          </div>
        </div>
        
        <Separator className="my-3 md:hidden" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Departure */}
          <div className="text-center">
            <p className="text-xl font-semibold">{departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.departure.airport}</p>
            <p className="text-xs text-muted-foreground">{departureDate}</p>
          </div>
          
          {/* Flight Path Visualization */}
          <div className="flex flex-col items-center mx-2 md:mx-4 w-full md:w-32">
            <div className="text-xs text-muted-foreground text-center">{flight.duration}</div>
            <div className="relative w-full mt-1 mb-1">
              <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-[1px] bg-muted"></div>
              <ArrowRight className="relative mx-auto text-muted-foreground h-4 w-4" />
            </div>
            <div className="text-xs text-accent-foreground text-center">{stopsDisplay}</div>
          </div>
          
          {/* Arrival */}
          <div className="text-center">
            <p className="text-xl font-semibold">{arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.arrival.airport}</p>
            <p className="text-xs text-muted-foreground">{arrivalDate}</p>
          </div>
        </div>
        
        <Separator className="my-3 md:hidden" />
        
        <div className="flex flex-col items-center md:items-end">
          <p className="text-2xl font-bold text-primary">${flight.price}</p>
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>{flight.duration}</span>
          </div>
          <Link to={`/flights/${flight.id}`}>
            <Button variant="outline" className="hover-scale w-full md:w-auto">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
