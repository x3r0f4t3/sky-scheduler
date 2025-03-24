
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Set environment variables
if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY = "pk_test_c2V0dGxlZC1maWxseS05MS5jbGVyay5hY2NvdW50cy5kZXYk";
}

if (!import.meta.env.VITE_SUPABASE_URL) {
  import.meta.env.VITE_SUPABASE_URL = "https://vcjbxduadsbbnpbepoxe.supabase.co";
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  import.meta.env.VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjamJ4ZHVhZHNiYm5wYmVwb3hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDIyMTQsImV4cCI6MjA1ODQxODIxNH0.m6sizjhft-7gRHD21EF0ammr264thHA_4Byfq1O0uJM";
}

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = "pk_test_51R6GHOJBCNdQWkIdhnjj4WdfIQzF0E5GWNsBqPWeUVoGLzF1UiD5uIFpchPPDOv5EGjPErPPd3hR3Rspk4QpSmVo00qnA0I9v9";
}

if (!import.meta.env.VITE_AVIATION_STACK_API_KEY) {
  import.meta.env.VITE_AVIATION_STACK_API_KEY = "d1b70303c2022bedbc837e29f29db077";
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
