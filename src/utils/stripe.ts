
// This would use the actual Stripe API in a real application
// For now, we'll use the test Stripe key for demo purposes

// Get Stripe publishable key from environment variable
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    // In a production app, this would call your backend API
    // which would create a PaymentIntent with Stripe
    // For this demo, we'll simulate a successful response
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return a mock clientSecret
    return {
      clientSecret: `pi_mock_secret_${Math.random().toString(36).substring(2, 15)}`,
      amount,
      currency
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const processPayment = async (paymentMethodId: string, amount: number) => {
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random transaction ID
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
