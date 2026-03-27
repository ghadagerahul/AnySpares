import { Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  console.log('AuthGuard: Checking authentication status...');
   console.log('AuthGuard: Current authentication status:', authService.isAuthenticated());
   alert('AuthGuard: Checking authentication status... Current status: ' + authService.isAuthenticated());
   console.log('AuthGuard: --------------------------------------------------');
  // Check if user is authenticated
  if (authService.isLoggedIn()) {
    alert('Access granted: User is authenticated');
    return true;
  }

  // If not authenticated, return false (prevents navigation without redirection)
  // You can customize this behavior as needed
  console.warn('Access denied: User not authenticated');
  alert('Access denied: Please log in to access this page.');
  return false;
};
