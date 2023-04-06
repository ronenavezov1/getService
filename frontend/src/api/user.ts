import { env } from "~/env.mjs";
import { fetchAuthed } from "~/utils/fetchAuthed";

const BASE_USER_API_URL = `${env.NEXT_PUBLIC_BASE_API_URL}users`;

export const fetchUserById = async (id: string) => {
  const res = await fetchAuthed(`${BASE_USER_API_URL}/${id}`);
  const data = await res.json();
  return data;
};
