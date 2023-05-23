import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { type ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import type { FC } from "react";
import { getServerAuthSession } from "~/server/auth";

const SignIn: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  return (
    <div className="flex h-screen  w-screen flex-col items-center justify-center gap-4 p-2  ">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold  leading-none text-yellow-400 ">
          Welcome to Get-Service
        </h2>
        <h2 className=" text-lg leading-none text-white">
          Your One-Stop Home Services Solution!
        </h2>
        <h2 className=" leading-none text-white">
          Experience hassle-free and reliable home services right at
          your fingertips.
        </h2>
      </div>
      <div className=" w-full max-w-lg p-2 ">
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
    <button
      className={`${provider.id}Btn`}
      onClick={() => void signIn(provider.id)}
    >
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
