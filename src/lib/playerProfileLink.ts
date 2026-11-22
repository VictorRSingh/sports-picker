/** Only link to Sports Picker player pages backed by a FOX Sports player path. */
export function playerProfileHref(sport: string, url: unknown): string | null {
  if (typeof url !== "string" || !url.trim()) return null;
  try {
    const parsed = new URL(url.trim(), "https://www.foxsports.com");
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    if (!['foxsports.com', 'www.foxsports.com'].includes(parsed.hostname.toLowerCase())) return null;
    const match = parsed.pathname.match(/^\/(nba|nfl|nhl|mlb|wnba)\/([a-z0-9-]+-player)\/?$/i);
    if (!match || match[1].toLowerCase() !== sport.toLowerCase()) return null;
    return `/p/${match[1].toLowerCase()}/${match[2].toLowerCase()}`;
  } catch { return null; }
}
