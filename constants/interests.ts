export const INTERESTS = [
  "Outdoor activities",
  "Arts & crafts",
  "Sports",
  "Music",
  "Reading",
  "STEM",
  "Cooking",
  "Animals",
  "Nature",
  "Dancing",
  "Theater",
  "Photography",
  "Gaming",
  "Travel",
  "Volunteering",
] as const;

export type Interest = (typeof INTERESTS)[number];

