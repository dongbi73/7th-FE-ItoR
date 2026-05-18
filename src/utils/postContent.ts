export const sortByContentOrder = <T extends { contentOrder: number }>(contents: T[]): T[] => {
  return [...contents].sort((a, b) => a.contentOrder - b.contentOrder);
};
