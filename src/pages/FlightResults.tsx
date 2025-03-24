
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flight, SearchParams } from '../types';
import { searchFlights } from '../utils/api';
import FlightCard from '../components/FlightCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const FlightResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('price');
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [stopFilter, setStopFilter] = useState<number[]>([]);
  
  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchParams: SearchParams = {
    from: queryParams.get('from') || '',
    to: queryParams.get('to') || '',
    departDate: queryParams.get('departDate') || new Date().toISOString(),
    returnDate: queryParams.get('returnDate') || undefined,
    passengers: parseInt(queryParams.get('passengers') || '1', 10),
    tripType: (queryParams.get('tripType') as 'oneWay' | 'roundTrip') || 'oneWay'
  };
  
  // Format the dates for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'EEE, MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  // List of all available airlines (would come from the flights data in a real app)
  const allAirlines = Array.from(new Set(flights.map(flight => flight.airline.name))).sort();
  
  // Fetch flights based on search params
  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        setLoading(true);
        const flightData = await searchFlights(searchParams);
        setFlights(flightData);
        setFilteredFlights(flightData);
        
        // Set initial price range based on the flight data
        if (flightData.length > 0) {
          const prices = flightData.map(flight => flight.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlightData();
  }, [location.search]);
  
  // Apply sorting and filtering
  useEffect(() => {
    let result = [...flights];
    
    // Apply airline filter
    if (selectedAirlines.length > 0) {
      result = result.filter(flight => selectedAirlines.includes(flight.airline.name));
    }
    
    // Apply stops filter
    if (stopFilter.length > 0) {
      result = result.filter(flight => stopFilter.includes(flight.stops));
    }
    
    // Apply price filter
    result = result.filter(
      flight => flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'departure':
          return a.departure.scheduled.localeCompare(b.departure.scheduled);
        case 'arrival':
          return a.arrival.scheduled.localeCompare(b.arrival.scheduled);
        default:
          return 0;
      }
    });
    
    setFilteredFlights(result);
  }, [flights, sortBy, selectedAirlines, stopFilter, priceRange]);
  
  // Toggle airline selection
  const toggleAirline = (airline: string) => {
    setSelectedAirlines(prev => 
      prev.includes(airline)
        ? prev.filter(a => a !== airline)
        : [...prev, airline]
    );
  };
  
  // Toggle stop filter
  const toggleStopFilter = (stops: number) => {
    setStopFilter(prev => 
      prev.includes(stops)
        ? prev.filter(s => s !== stops)
        : [...prev, stops]
    );
  };
  
  // Handle "Go Back" action
  const handleGoBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-muted/30">
      {/* Search summary */}
      <div className="bg-primary text-primary-foreground py-4 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {searchParams.from} to {searchParams.to}
              </h1>
              <p className="text-primary-foreground/80">
                {formatDate(searchParams.departDate)} • {searchParams.passengers} {searchParams.passengers === 1 ? 'Passenger' : 'Passengers'}
                {searchParams.returnDate && ` • Return: ${formatDate(searchParams.returnDate)}`}
              </p>
            </div>
            <Button 
              variant="outline" 
              className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 mt-4 md:mt-0"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Modify Search
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters for desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-background rounded-lg border border-border p-4 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              <Accordion type="single" collapsible defaultValue="price">
                {/* Price Range */}
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <div className="flex space-x-4">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full"
                          min={0}
                        />
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full"
                          min={priceRange[0]}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Airlines */}
                <AccordionItem value="airlines">
                  <AccordionTrigger>Airlines</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 py-2">
                      {allAirlines.map(airline => (
                        <div key={airline} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`airline-${airline}`}
                            checked={selectedAirlines.includes(airline)}
                            onCheckedChange={() => toggleAirline(airline)}
                          />
                          <label 
                            htmlFor={`airline-${airline}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {airline}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Stops */}
                <AccordionItem value="stops">
                  <AccordionTrigger>Stops</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 py-2">
                      {[0, 1, 2].map(stops => (
                        <div key={stops} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`stops-${stops}`}
                            checked={stopFilter.includes(stops)}
                            onCheckedChange={() => toggleStopFilter(stops)}
                          />
                          <label 
                            htmlFor={`stops-${stops}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {stops === 0 ? 'Nonstop' : `${stops} ${stops === 1 ? 'stop' : 'stops'}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  setSelectedAirlines([]);
                  setStopFilter([]);
                  if (flights.length > 0) {
                    const prices = flights.map(flight => flight.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([minPrice, maxPrice]);
                  }
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Results area */}
          <div className="flex-1">
            {/* Sort and filter controls */}
            <div className="bg-background rounded-lg border border-border p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0 w-full sm:w-auto">
                <p className="text-sm text-muted-foreground mb-1">
                  {filteredFlights.length} {filteredFlights.length === 1 ? 'flight' : 'flights'} found
                </p>
                <Select 
                  value={sortBy} 
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="duration">Duration: Shortest</SelectItem>
                    <SelectItem value="departure">Departure: Earliest</SelectItem>
                    <SelectItem value="arrival">Arrival: Earliest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Mobile filter button */}
              <Button 
                variant="outline" 
                className="md:hidden w-full sm:w-auto"
                onClick={() => setFilterModalOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {/* Flight results */}
            <div className="space-y-4">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="bg-background rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between animate-pulse">
                      <div className="flex items-center mb-4 md:mb-0">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        <div>
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-3 w-24 mt-1" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                        
                        <div className="mx-2 md:mx-4 w-full md:w-32">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full mt-2" />
                        </div>
                        
                        <div>
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-3 w-24 mt-1" />
                          <Skeleton className="h-3 w-20 mt-1" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center md:items-end">
                        <Skeleton className="h-7 w-20" />
                        <Skeleton className="h-3 w-24 mt-1" />
                        <Skeleton className="h-8 w-28 mt-2" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredFlights.length === 0 ? (
                <div className="bg-background rounded-lg p-8 text-center">
                  <p className="text-lg font-medium mb-2">No flights found</p>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search for different dates.
                  </p>
                  <Button onClick={handleGoBack}>
                    Modify Search
                  </Button>
                </div>
              ) : (
                filteredFlights.map(flight => (
                  <FlightCard key={flight.id} flight={flight} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile filter modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden animate-fade-in">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setFilterModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <Accordion type="single" collapsible defaultValue="price">
                {/* Price Range */}
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      <div className="flex justify-between">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <div className="flex space-x-4">
                        <Input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full"
                          min={0}
                        />
                        <Input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full"
                          min={priceRange[0]}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Airlines */}
                <AccordionItem value="airlines">
                  <AccordionTrigger>Airlines</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 py-2">
                      {allAirlines.map(airline => (
                        <div key={airline} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-airline-${airline}`}
                            checked={selectedAirlines.includes(airline)}
                            onCheckedChange={() => toggleAirline(airline)}
                          />
                          <label 
                            htmlFor={`mobile-airline-${airline}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {airline}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Stops */}
                <AccordionItem value="stops">
                  <AccordionTrigger>Stops</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 py-2">
                      {[0, 1, 2].map(stops => (
                        <div key={stops} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`mobile-stops-${stops}`}
                            checked={stopFilter.includes(stops)}
                            onCheckedChange={() => toggleStopFilter(stops)}
                          />
                          <label 
                            htmlFor={`mobile-stops-${stops}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {stops === 0 ? 'Nonstop' : `${stops} ${stops === 1 ? 'stop' : 'stops'}`}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="p-4 border-t flex space-x-4">
              <Button 
                variant="outline" 
                className="w-1/2"
                onClick={() => {
                  setSelectedAirlines([]);
                  setStopFilter([]);
                  if (flights.length > 0) {
                    const prices = flights.map(flight => flight.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    setPriceRange([minPrice, maxPrice]);
                  }
                }}
              >
                Reset
              </Button>
              <Button 
                className="w-1/2"
                onClick={() => setFilterModalOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightResults;
