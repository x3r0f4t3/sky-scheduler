
import { withClerk } from "@clerk/clerk-react";
import { NavigateFunction } from "react-router-dom";

// This middleware function will be used to protect routes
export const middleware = withClerk((
  { userId, sessionId, getToken }, 
  { next, navigate }:
  { next: () => void, navigate: NavigateFunction }
) => {
  // If there's no userId, redirect to the sign in page
  if (!userId) {
    navigate("/sign-in");
    return;
  }
  
  // Call the next middleware function or the protected component
  next();
});

// A higher-order component to wrap protected routes
export const withAuth = (Component: React.ComponentType) => {
  return withClerk((props: any) => {
    const { userId, sessionId } = props.clerk;
    
    if (!sessionId) {
      // If no session, redirect to sign in
      props.navigate("/sign-in");
      return null;
    }
    
    // User is authenticated, render the component
    return <Component {...props} />;
  });
};

// Export a utility to check if user is authenticated
export const isAuthenticated = async (clerkClient: any) => {
  try {
    const { userId } = clerkClient;
    return !!userId;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};
