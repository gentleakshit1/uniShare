// Centralized API module for making requests to Django
// This keeps our components clean and makes the code modular

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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
export async function fetchResources(searchQuery?: string, token?: string | null) {
  try {
    let url = `${API_BASE}/resources/`;
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { 
      cache: "no-store",
      headers
    });
    
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
 * Fetches a single resource by its ID
 */
export async function fetchResourceById(id: string, token?: string | null) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/resources/${id}/`, {
      cache: "no-store",
      headers
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch resource: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error(`[API Error] fetchResourceById failed for id ${id}:`, error);
    // Fallback to mock data if backend unreachable
    const mock = MOCK_RESOURCES.find(r => r.id.toString() === id);
    if (mock) return mock;
    throw error;
  }
}

/**
 * Uploads a new resource using FormData
 */
export async function uploadResource(formData: FormData, token?: string | null) {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/resources/`, {
      method: "POST",
      headers,
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

export async function voteResource(id: number, voteType: 'UP' | 'DOWN', token: string) {
  const res = await fetch(`${API_BASE}/resources/${id}/vote/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ vote_type: voteType })
  });
  if (!res.ok) throw new Error("Failed to vote");
  return await res.json();
}

export async function downloadResource(id: number) {
  // Download tracking can be public or authenticated, we make it public for now
  const res = await fetch(`${API_BASE}/resources/${id}/download/`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to track download");
  return await res.json();
}

export async function fetchMyResources(token: string) {
  const res = await fetch(`${API_BASE}/resources/my_resources/`, {
    headers: {
      "Authorization": `Bearer ${token}`
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load dashboard data");
  return await res.json();
}

export async function fetchServices(searchQuery?: string) {
  try {
    let url = `${API_BASE}/services/`;
    if (searchQuery) {
      url += `?search=${encodeURIComponent(searchQuery)}`;
    }
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load services");
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch services", error);
    return [];
  }
}

export async function createService(serviceData: any, token: string) {
  const res = await fetch(`${API_BASE}/services/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(serviceData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(JSON.stringify(err));
  }
  return await res.json();
}
