export const fetchTeams = (gameUrl: string): { awayTeam: string; homeTeam: string } => {
  const match = gameUrl.match(/\/[^/]+\/(.*)-vs-(.*)-game-boxscore-\d+$/);

  if (!match || match.length < 3) {
    throw new Error("Invalid game URL format");
  }

  const awayTeamSlug = match[1]; // e.g., "connecticut-sun"
  const homeTeamSlugWithDate = match[2]; // e.g., "phoenix-mercury-aug-05-2025"

  const months = [
    "jan", "feb", "mar", "apr", "may", "jun",
    "jul", "aug", "sep", "oct", "nov", "dec",
  ];

  const parts = homeTeamSlugWithDate.split("-");
  const monthIndex = parts.findIndex((p) => months.includes(p.toLowerCase()));

  const homeTeamParts = monthIndex > 0 ? parts.slice(0, monthIndex) : parts;

  const awayTeam = awayTeamSlug
  const homeTeam = homeTeamParts.join("-");

  return { awayTeam, homeTeam };
};
