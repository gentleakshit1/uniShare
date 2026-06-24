// Centralized API module for making requests to Django
// This keeps our components clean and makes the code modular

const API_BASE = "http://localhost:8000/api";

// Dummy data fallback for UI designers when the backend is unreachable
const MOCK_RESOURCES = [
  {
    id: 1,
    title: "Data Structures Complete Notes",
    course: "CS201",
    subject: "Computer Science",
    semester: 3,
    type: "Notes",
    file: "#"
  },
  {
    id: 2,
    title: "Calculus II Midterm Paper 2024",
    course: "MATH102",
    subject: "Mathematics",
    semester: 2,
    type: "Past Paper",
    file: "#"
  },
  {
    id: 3,
    title: "Quantum Physics Lab Manual",
    course: "PHY301",
    subject: "Physics",
    semester: 5,
    type: "Lab Report",
    file: "#"
  }
];

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
      console.warn("Backend reachable but returned an error. Falling back to Mock Data for UI previews.");
      return MOCK_RESOURCES;
    }
    
    return await res.json();
  } catch (error) {
    console.warn("Backend is completely unreachable. Falling back to Mock Data for UI previews.");
    // Instead of throwing an error and crashing the deployed site, 
    // we gracefully return realistic dummy data so the UI designer can test it!
    return MOCK_RESOURCES;
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
