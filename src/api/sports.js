import axios from "axios";

const BASE_URL = "https://free-api-live-football-data.p.rapidapi.com/football-current-live";

export const getLiveMatches = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        "x-rapidapi-host": "free-api-live-football-data.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      },
    });

    const liveMatches = response.data.response?.live || [];

    if (!liveMatches.length) {
      return { response: [] }; // Return an empty array if no live matches
    }

    // Safely process matches
    return {
      response: liveMatches.map((match) => ({
        home: match?.home?.name || "Unknown Team",
        away: match?.away?.name || "Unknown Team",
        score: match?.status?.scoreStr || "N/A",
        time: match?.status?.liveTime?.long || "Ongoing",
      })),
    };
  } catch (error) {
    console.error("Error fetching live matches:", error.message);
    return { error: "Unable to fetch live match data at the moment." };
  }
};



