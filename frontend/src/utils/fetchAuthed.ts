import { signOut } from "next-auth/react";

//Signout off nextAuth if 401 is returned from the server
export async function fetchAuthed(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 401) {
    await signOut();
    return Promise.reject(new Error("Unauthorized"));
  }

  return res;
}
