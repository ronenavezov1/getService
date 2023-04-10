import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { FC } from "react";
import { getServerAuthSession } from "~/server/auth";

const SignIn: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  return (
    <div className="flex h-full w-full flex-col items-center gap-2 p-2">
      <div>
        <h1 className="text-5xl text-yellow-400 ">Sign in</h1>
      </div>
      <div className=" card w-full max-w-lg ">
        {Object.values(providers).map((provider) => (
          <ProviderBtn key={provider.name} provider={provider} />
        ))}
      </div>
    </div>
  );
};

export default SignIn;

interface ProviderBtnProps {
  provider: ClientSafeProvider;
}

/*Button to sign in with a provider*/
const ProviderBtn: FC<ProviderBtnProps> = ({ provider }) => {
  return (
    <button className={`${provider.id}Btn`} onClick={() => signIn(provider.id)}>
      <span className="inline-block">Continue with {provider.name}</span>
    </button>
  );
};

/*Check if user is logged in and pass auth providers to the page */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session) return { redirect: { destination: "/" } };
  const providers = await getProviders();

  return {
    props: { session, providers: providers ?? [] },
  };
}
