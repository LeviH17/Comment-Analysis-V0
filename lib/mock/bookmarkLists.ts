/**
 * Mock of the user's existing Pendulum bookmark lists. These are separate
 * from Comment Analysis folders — they're the pre-existing My Collection >
 * Bookmarks > [list] data that a Pendulum user has already curated. When
 * creating a new Comment Analysis folder, the user can pull posts from
 * any of these lists to seed the folder.
 */

export type BookmarkList = {
  id: string;
  name: string;
  description?: string;
  postIds: string[];
};

export const bookmarkLists: BookmarkList[] = [
  {
    id: "bl-ev-recall",
    name: "EV recall tracking",
    description: "Posts tracking the Rivian R1S battery recall story",
    postIds: ["post-001", "post-007", "post-010", "post-011", "post-015"],
  },
  {
    id: "bl-mom-influencers",
    name: "Mom influencer watchlist",
    description: "Sponsored and organic mom-influencer content",
    postIds: ["post-005", "post-006", "post-009", "post-013"],
  },
  {
    id: "bl-cali-airquality",
    name: "California air quality",
    description: "Wildfire response and AQI in California",
    postIds: ["post-004", "post-008", "post-014"],
  },
  {
    id: "bl-climate-news",
    name: "Climate & pollution news",
    description: "Cross-region climate and air-pollution policy",
    postIds: ["post-002", "post-003", "post-008", "post-012"],
  },
];

export function getBookmarkList(id: string): BookmarkList | undefined {
  return bookmarkLists.find((l) => l.id === id);
}
