
import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, Clock, Globe, Plane, Shield } from 'lucide-react';

const Index: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/90 to-primary"></div>
        <div 
          className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-40"
        ></div>
        
        <div className="container mx-auto px-4 z-10">
          <div className={`max-w-4xl transition-all duration-1000 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Find Your Perfect Flight
            </h1>
            <p className="text-white/90 text-xl md:text-2xl mb-8">
              Search, compare, and book flights with ease
            </p>
            
            <SearchForm />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkyBooker</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
              <p className="text-muted-foreground">
                Access to flights from hundreds of airlines covering destinations worldwide.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">
                Compare prices across multiple airlines to find the best deals available.
              </p>
            </div>
            
            <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center hover-scale">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-muted-foreground">
                Book with confidence with our secure payment system and customer protection.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Popular Destinations</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore our most sought-after destinations and find inspiration for your next journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden group cursor-pointer hover-scale"
              >
                <div className="aspect-[4/3]">
                  <img 
                    src={destination.image} 
                    alt={destination.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-semibold">{destination.name}</h3>
                  <p className="text-white/80 flex items-center mt-1">
                    <Plane className="h-4 w-4 mr-1" />
                    Flights from ${destination.price}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-fit"
                  >
                    Explore <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">"{testimonial.text}"</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Off?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Sign up now to receive exclusive deals and personalized flight recommendations.
          </p>
          <Button 
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

// Example destination data
const destinations = [
  {
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    price: 299
  },
  {
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2336&q=80',
    price: 599
  },
  {
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    price: 249
  },
  {
    name: 'Sydney, Australia',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    price: 699
  },
  {
    name: 'Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
    price: 399
  },
  {
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2338&q=80',
    price: 449
  }
];

// Example testimonial data
const testimonials = [
  {
    name: 'Jessica Chen',
    location: 'San Francisco, CA',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'I booked a last-minute flight to visit my family and saved over $200 compared to other sites. The process was smooth and the confirmation was instant.',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    location: 'Chicago, IL',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'SkyBooker made it so easy to change my flight when my plans changed. Their customer service was responsive and helpful throughout the process.',
    rating: 4
  },
  {
    name: 'Sarah Johnson',
    location: 'London, UK',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'I've been using SkyBooker for all my business travel needs. The interface is intuitive and I can quickly find and book the flights I need.',
    rating: 5
  }
];

export default Index;
