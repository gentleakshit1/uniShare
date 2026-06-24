"use client";

import { useEffect, useRef } from "react";
import { useUser, useAuth } from "@clerk/nextjs";

export function SyncUser() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  // Use a ref to ensure we only sync once per session to avoid spamming the backend
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasSynced.current) return;

    const syncToBackend = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
        
        await fetch(`${API_BASE}/users/sync/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            first_name: user.firstName || "",
            last_name: user.lastName || "",
            email: user.primaryEmailAddress?.emailAddress || ""
          })
        });

        // Mark as synced so we don't hit the API again until reload
        hasSynced.current = true;
      } catch (error) {
        console.error("Failed to sync user with backend:", error);
      }
    };

    syncToBackend();
  }, [user, isLoaded, getToken]);

  return null; // This is a purely functional component, it renders nothing
}
