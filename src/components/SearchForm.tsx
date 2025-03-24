
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchParams } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { CalendarIcon, PlaneTakeoff, PlaneLanding, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Common locations for suggestions
const popularLocations = [
  "New York (JFK)",
  "London (LHR)",
  "Paris (CDG)",
  "Tokyo (HND)",
  "Dubai (DXB)",
  "Singapore (SIN)",
  "Los Angeles (LAX)",
  "Sydney (SYD)",
  "Hong Kong (HKG)",
  "Berlin (BER)"
];

interface SearchFormProps {
  className?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ className }) => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departDate, setDepartDate] = useState<Date>(addDays(new Date(), 1));
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    tripType === 'roundTrip' ? addDays(new Date(), 8) : undefined
  );
  const [passengers, setPassengers] = useState('1');
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [isFromFocused, setIsFromFocused] = useState(false);
  const [isToFocused, setIsToFocused] = useState(false);

  // Handle trip type change
  const handleTripTypeChange = (value: string) => {
    setTripType(value as 'oneWay' | 'roundTrip');
    if (value === 'roundTrip' && !returnDate) {
      setReturnDate(addDays(departDate, 7));
    }
  };

  // Filter locations for suggestions
  const filterLocations = (input: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (input.length < 1) {
      setter([]);
      return;
    }
    
    const filtered = popularLocations.filter(location => 
      location.toLowerCase().includes(input.toLowerCase())
    );
    setter(filtered);
  };

  // Handle from location change
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromLocation(value);
    filterLocations(value, setFromSuggestions);
  };

  // Handle to location change
  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToLocation(value);
    filterLocations(value, setToSuggestions);
  };

  // Select a suggestion
  const selectSuggestion = (
    suggestion: string, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    suggestionSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(suggestion);
    suggestionSetter([]);
  };

  // Search flights handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromLocation || !toLocation) {
      toast.error('Please select both departure and arrival locations');
      return;
    }
    
    if (fromLocation === toLocation) {
      toast.error('Departure and arrival locations cannot be the same');
      return;
    }
    
    if (!departDate) {
      toast.error('Please select a departure date');
      return;
    }
    
    if (tripType === 'roundTrip' && !returnDate) {
      toast.error('Please select a return date');
      return;
    }
    
    const searchParams: SearchParams = {
      from: fromLocation,
      to: toLocation,
      departDate: departDate.toISOString(),
      passengers: parseInt(passengers, 10),
      tripType,
    };
    
    if (tripType === 'roundTrip' && returnDate) {
      searchParams.returnDate = returnDate.toISOString();
    }
    
    // Convert to query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('from', searchParams.from);
    queryParams.append('to', searchParams.to);
    queryParams.append('departDate', searchParams.departDate);
    queryParams.append('passengers', searchParams.passengers.toString());
    queryParams.append('tripType', searchParams.tripType);
    
    if (searchParams.returnDate) {
      queryParams.append('returnDate', searchParams.returnDate);
    }
    
    navigate(`/flights?${queryParams.toString()}`);
  };

  return (
    <div className={cn("glass-card rounded-xl p-6 shadow-lg w-full max-w-4xl mx-auto", className)}>
      <Tabs defaultValue={tripType} onValueChange={handleTripTypeChange} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="oneWay" className="text-base py-2">One Way</TabsTrigger>
          <TabsTrigger value="roundTrip" className="text-base py-2">Round Trip</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Location */}
            <div className="relative">
              <div className="flex items-center bg-background border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <PlaneTakeoff className="h-4 w-4 mx-3 text-muted-foreground" />
                <Input
                  placeholder="From"
                  value={fromLocation}
                  onChange={handleFromChange}
                  onFocus={() => setIsFromFocused(true)}
                  onBlur={() => setTimeout(() => setIsFromFocused(false), 200)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {isFromFocused && fromSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-background border border-input mt-1 rounded-md shadow-lg py-1 max-h-60 overflow-auto animate-scale-in">
                  {fromSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => selectSuggestion(suggestion, setFromLocation, setFromSuggestions)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* To Location */}
            <div className="relative">
              <div className="flex items-center bg-background border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <PlaneLanding className="h-4 w-4 mx-3 text-muted-foreground" />
                <Input
                  placeholder="To"
                  value={toLocation}
                  onChange={handleToChange}
                  onFocus={() => setIsToFocused(true)}
                  onBlur={() => setTimeout(() => setIsToFocused(false), 200)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {isToFocused && toSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-background border border-input mt-1 rounded-md shadow-lg py-1 max-h-60 overflow-auto animate-scale-in">
                  {toSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => selectSuggestion(suggestion, setToLocation, setToSuggestions)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Departure Date */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center bg-background border border-input rounded-md p-2 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium text-left">Depart</div>
                    <div className="text-muted-foreground">
                      {departDate ? format(departDate, 'PPP') : "Select date"}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={departDate}
                  onSelect={(date) => date && setDepartDate(date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            {/* Return Date (only for round trip) */}
            {tripType === 'roundTrip' && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center bg-background border border-input rounded-md p-2 cursor-pointer focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 animate-fade-in">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div className="text-sm">
                      <div className="font-medium text-left">Return</div>
                      <div className="text-muted-foreground">
                        {returnDate ? format(returnDate, 'PPP') : "Select date"}
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={(date) => date && setReturnDate(date)}
                    disabled={(date) => date < departDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
            
            {/* Passengers */}
            <div className="flex items-center bg-background border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Users className="h-4 w-4 mx-3 text-muted-foreground" />
              <Select 
                value={passengers} 
                onValueChange={setPassengers}
              >
                <SelectTrigger className="border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full p-2">
                  <SelectValue placeholder="Passengers" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full py-6 text-lg font-medium btn-hover-effect"
          >
            Search Flights
          </Button>
        </form>
      </Tabs>
    </div>
  );
};

export default SearchForm;
