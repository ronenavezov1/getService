import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { Session } from "next-auth/core/types";
import { JWT } from "next-auth/jwt/types";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    //TODO: add user interface instead of any
    user: any & DefaultSession["user"];
    jwtToken: JWT;
  }

  interface User {
    role: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  jwt: {},

  callbacks: {
    async jwt({ token, account, user, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;

        //debugging
        console.log("token", token);
        console.log("account", account);
        console.log("profile", profile);
        console.log("user", user);
      }

      if (user) {
        token.id = user.id;
      }

      return token;
    },

    // Send properties to the client, like an access_token and user id from a provider.
    async session({ session, token }) {
      session.jwtToken = token;
      await setUserFromDb(session);
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

/**
 * Fetches the user from the database and sets it on the session.
 * On failure, the user is set to null.
 * @param session
 */
async function setUserFromDb(session: Session) {
  //TODO: implement this

  try {
    const userRes = await fetch(`${env.BASE_API_URL}/test/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!userRes.ok) {
      console.log("NextAuth:!userRes.ok"); //debugging
      session.user = null;
      return;
    }

    const user = await userRes.json();
    session.user = user;
  } catch (err) {
    console.log("NextAuth:Failed to fetch user", err); //debugging
    session.user = null;
  }
}
