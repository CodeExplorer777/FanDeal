
import api from "./api";

export const createPoster = async (posterData) => {
  const response = await api.post("/posters", posterData);
  return response.data;
};
export const getMyPoster = async () => {
  const url = "http://localhost:5000/api/posters/my-poster";

  console.log("Request URL:", url);
  console.log("Token exists:", !!localStorage.getItem("token"));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  console.log("Response status:", response.status);
  console.log("Response URL:", response.url);
  console.log("Content type:", response.headers.get("content-type"));

  const text = await response.text();

  console.log("Raw response:", text);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 150)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Backend returned HTML instead of JSON. Check server routing.");
  }
};