import fetchAuthed from "~/utils/fetchAuthed";

export async function fetchUser() {
  const res = await fetchAuthed("http://localhost:4000/api/test/1");
  const data = await res.json();
  return data;
}
