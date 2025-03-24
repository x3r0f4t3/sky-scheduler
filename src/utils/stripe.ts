
// This would use the actual Stripe API in a real application
// For now, we'll mock the Stripe functionality

export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock clientSecret
  return {
    clientSecret: `pi_mock_secret_${Math.random().toString(36).substring(2, 15)}`,
    amount,
    currency
  };
};

export const processPayment = async (paymentMethodId: string, amount: number) => {
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
};
