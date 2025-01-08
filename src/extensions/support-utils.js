import { getLiveMatches } from "../api/sports.js";

export const getLiveMatchesFunctionDeclaration = {
  name: "getLiveMatches",
  description: "Fetches live football matches and their scores",
  parameters: {
    type: "object",
    properties: {
      placeholder: {
        type: "string",
        description: "A placeholder parameter. This is not used but required by the API.",
      },
    },
  },
};

export const questionSports = {
  getLiveMatches: async () => {
    const matches = await getLiveMatches();
    if (matches.error) {
      return { error: matches.error };
    }

    // Combine match data into a single summary string
    const summary = matches.response
      .map(
        (match) =>
          `The match between ${match.home} and ${match.away} is at ${match.time}, with a score of ${match.score}.`
      )
      .join(" ");

    return { response: summary };
  },
};




