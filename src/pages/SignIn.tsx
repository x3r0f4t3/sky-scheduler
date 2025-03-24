
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        <ClerkSignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full max-w-md",
              card: "bg-background shadow-lg rounded-lg border border-border p-8",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-muted-foreground text-center",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-background border border-input focus:ring-2 focus:ring-ring focus:ring-offset-2",
              footerActionLink: "text-primary hover:text-primary/90",
              identityPreviewEditButton: "text-primary hover:text-primary/90",
              formResendCodeLink: "text-primary hover:text-primary/90",
            },
          }}
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          routing="path"
          path="/sign-in"
        />
      </div>
    </div>
  );
};

export default SignIn;
