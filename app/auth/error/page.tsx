'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChefHat, AlertCircle } from 'lucide-react';

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An unexpected error occurred. Please try again.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') as keyof typeof errorMessages;
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Ghar Ka Khana</span>
          </div>
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with your authentication
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/login">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}