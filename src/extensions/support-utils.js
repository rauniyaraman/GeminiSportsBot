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

    // Format the live matches into a readable structure
    const formattedMatches = matches.response
      .map(
        (match, index) => `
${index + 1}. **${match.home} vs ${match.away}**
   - **Score**: ${match.score}
   - **Time**: ${match.time.includes('Half') ? match.time : `${match.time}`}
`
      )
      .join("\n");

    const response = `
### Live Football Matches
${formattedMatches}
---

These scores and times are approximate and subject to change as the matches progress.
    `;
    return { response };
  },
};


