const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function fetchUnitsApi(courseCode?: string) {
  try {
    const params = courseCode ? `?course=${courseCode}` : "";
    const res = await fetch(`${API_BASE_URL}/units${params}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch units from backend");
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, using client fallback units:", error);
    return null;
  }
}

export async function fetchLessonApi(lessonId: string | number) {
  try {
    const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch lesson from backend");
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, using client fallback lesson:", error);
    return null;
  }
}

export async function syncProgressApi(data: {
  xp?: number;
  streak?: number;
  hearts?: number;
  gems?: number;
  completed_lesson_id?: number;
}) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/sync-progress?user_id=1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to sync progress");
    return await res.json();
  } catch (error) {
    console.warn("Progress sync offline:", error);
    return null;
  }
}

export async function loginUserApi(name: string, email?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json();
  } catch (error) {
    console.warn("User login API offline:", error);
    return null;
  }
}

export async function fetchCoursesApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/courses`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch courses from backend");
    return await res.json();
  } catch (error) {
    console.warn("Backend API unavailable, using client fallback courses:", error);
    return null;
  }
}

