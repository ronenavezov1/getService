import type { Call } from "~/api/call";

export function sortByDate(a: Call, b: Call) {
  return (
    new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
  );
}
