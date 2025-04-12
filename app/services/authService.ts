/**
 * Helper functions for authentication and authorization
 */

/**
 * Extract user role from JWT token
 */
export const getUserRole = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    // First check if we have the role in localStorage
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) return storedRole;
    
    // If not found in localStorage, extract from token
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);
    const role = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
    
    // Store the extracted role in localStorage for future use
    if (role) {
      localStorage.setItem("userRole", role);
    }
    
    return role;
  } catch (error) {
    console.error("Error extracting role from token:", error);
    return null;
  }
};

/**
 * Check if current user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

/**
 * Check if current user has any of the specified roles
 */
export const hasAnyRole = (roles: string[]): boolean => {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem("accessToken");
};

/**
 * Extract user ID from JWT token or localStorage
 */
export const getUserId = (): string | null => {
  try {
    if (typeof window === 'undefined') return null;
    
    // First check localStorage for userId
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) return storedUserId;
    
    // Try to extract from token if not in localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const claims = JSON.parse(decodedPayload);
    
    return claims.userId || 
           claims.UserID || 
           claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata"] || 
           null;
  } catch (error) {
    console.error("Error extracting userId:", error);
    return null;
  }
};

/**
 * Clear all authentication data from localStorage and log out the user
 */
export const logout = (): void => {
  if (typeof window === 'undefined') return;
  
  // Clear all auth-related items from localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  localStorage.removeItem("fullname");
  localStorage.removeItem("email");
  localStorage.removeItem("avatar");
  
  // Dispatch an auth-change event to notify components
  window.dispatchEvent(new Event("auth-change"));
}; 