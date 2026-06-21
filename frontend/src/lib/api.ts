// Centralized API module for making requests to Django
// This keeps our components clean and makes the code modular

const API_BASE = "http://localhost:8000/api";

/**
 * Fetches all resources from the backend, with optional search filtering
 */
export async function fetchResources(searchQuery?: string) {
  try {
    let url = `${API_BASE}/resources/`;
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    
    const res = await fetch(url, { cache: "no-store" });
    
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("[API Error] fetchResources failed:", error);
    throw new Error("Failed to load resources from the server. Please check your connection.");
  }
}

/**
 * Uploads a new resource using FormData
 */
export async function uploadResource(formData: FormData) {
  try {
    const res = await fetch(`${API_BASE}/resources/`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      // If the server returns a 400 Bad Request, we extract the JSON error message
      const errorData = await res.json();
      
      // We format the Django validation errors into a readable string
      const formattedErrors = Object.entries(errorData)
        .map(([field, errors]) => `${field.toUpperCase()}: ${errors}`)
        .join(" | ");
        
      throw new Error(formattedErrors || "Upload rejected by server.");
    }
    
    return true;
  } catch (error: any) {
    console.error("[API Error] uploadResource failed:", error);
    // Rethrow to let the UI component handle displaying the error to the user
    throw new Error(error.message || "An unexpected error occurred during upload.");
  }
}
