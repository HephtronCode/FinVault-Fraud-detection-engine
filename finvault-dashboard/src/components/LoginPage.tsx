// src/components/LoginPage.tsx

import { useState } from 'react';
import type { FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Use a status flag for loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent) => {
    // Prevent the default form submission which reloads the page
    event.preventDefault(); 
    setIsLoading(true);

    // --- DEBUGGING LOGS (Good for temporary testing) ---
    console.log("Attempting to sign in with email:", email);
    // You would never log a password in a real app, but for local debugging it's useful to ensure the state is being read correctly.
    console.log("Supabase Client initialized status:", !!supabase);
    // --- END DEBUGGING LOGS ---


    // Call the Supabase client to perform the sign in action
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Log the full error to the browser console for deep debugging
      console.error("Supabase Login Error:", error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } else {
      // If no error, the login was successful. The AuthContext automatically detects
      // the new session, updates its state, and rerenders the app to show the dashboard.
      console.log("Supabase Login Success. Rerender imminent.");
      // We don't need a success toast because the user's screen will immediately change.
    }
    
    // Crucially, turn off loading state, regardless of success or failure
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>FinVault Login</CardTitle>
          <CardDescription>Enter your credentials to access the case queue.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="analyst@finvault.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {/* Conditional rendering for the loading spinner */}
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}