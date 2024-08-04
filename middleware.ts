import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Function to verify TOKEN
async function verifyToken(token: string): Promise<boolean> {
  // This is a placeholder function. In a real-world scenario,
  // you would verify the token against your backend or a JWT library.
  // For this example, we'll just check if the token exists and is not empty.
  return !!token && token.length > 0;
}

export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname;

  // Check if TOKEN exists in the cookies
  const token = request.cookies.get('TOKEN')?.value;

  // If user is trying to access signin page
  if (path === '/signin') {
    if (token) {
      // If TOKEN exists, verify it
      const isValidToken = await verifyToken(token);
      if (isValidToken) {
        // If TOKEN is valid, redirect to dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    // If no token or invalid token, allow access to signin page
    return NextResponse.next();
  }

  // For other routes, proceed with the existing logic
  if (!protectedRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    // Redirect to signin page if TOKEN is missing
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Verify the token
  const isValidToken = await verifyToken(token);

  if (!isValidToken) {
    // Redirect to signin page if TOKEN is invalid
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If TOKEN is valid, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run for protected routes and signin page
export const config = {
  matcher: [...protectedRoutes, '/signin']
};
