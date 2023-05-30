import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import Lottie from "lottie-react";
import { useSession } from "next-auth/react";
import { useState, type FC, type Dispatch, type SetStateAction } from "react";
import {
  FormProvider,
  type SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { CallStatus, useGetCall } from "~/api/call";
import { useGetUserByIdToken } from "~/api/user";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import CallCard from "~/components/CallCard";
import CityInput from "~/components/Inputs/CityInput";
import ProfessionInput from "~/components/Inputs/ProfessionInput";
import { sortByDate } from "~/utils/sortUtils";
import toolsAnimation from "public/lottie/95851-tools.json";
import noDataAnimation from "public/lottie/107420-no-data-loader.json";

const defualtPickQueryParams = {
  status: CallStatus.NEW,
};

const PickQuerySchema = z.object({
  profession: z.string().optional(),
  city: z.string().optional(),
  dateLimit: z.number().optional(), //TODO: sets 0 if empty
  status: z
    .enum([CallStatus.NEW, CallStatus.IN_PROGRESS, CallStatus.DONE])
    .optional(),
});

type PickQuerySchemaType = z.infer<typeof PickQuerySchema>;

const Pick: NextPageWithAuth = () => {
  const [queryParams, setQueryParams] = useState<PickQuerySchemaType>(
    defualtPickQueryParams
  );

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <PickQuery setQueryParams={setQueryParams} />
      <QueryCallsResult queryParams={queryParams} />
    </div>
  );
};

Pick.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.WORKER],
};

interface PickQueryProps {
  setQueryParams: Dispatch<SetStateAction<PickQuerySchemaType>>;
}

const PickQuery = ({ setQueryParams }: PickQueryProps) => {
  const formHook = useForm<PickQuerySchemaType>({
    resolver: zodResolver(PickQuerySchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  const onSubmit: SubmitHandler<PickQuerySchemaType> = (data) => {
    setQueryParams(data);
  };

  return (
    <FormProvider {...formHook}>
      <Disclosure>
        {({ close, open }) => (
          <>
            <Disclosure.Button
              className={`
            ${
              open
                ? "bg-indigo-700 text-yellow-500"
                : "bg-indigo-600 text-white"
            }
            flex w-full max-w-2xl gap-2  rounded-xl  p-2  text-sm font-bold  hover:bg-indigo-700`}
            >
              <div className="grow">Search</div>
              <ChevronLeftIcon
                className={`${open ? "-rotate-90 transform" : ""}   h-5 `}
              />
            </Disclosure.Button>
            <div className="relative flex h-full  w-full justify-center">
              <Disclosure.Panel className="absolute z-10 w-full  max-w-2xl text-gray-500  shadow-2xl">
                <form
                  onSubmit={handleSubmit(() => {
                    onSubmit(formHook.getValues());
                    close();
                  })}
                  className="card"
                >
                  <div className=" flex flex-wrap gap-1 ">
                    <div className="grow">
                      <ProfessionInput />
                    </div>
                    <div className="grow">
                      <CityInput />
                    </div>
                    <div className="grow">
                      <DateLimitInput />
                    </div>
                  </div>

                  <input
                    className="mt-2 w-full  rounded bg-yellow-400 p-2 font-bold text-white hover:bg-yellow-500"
                    disabled={isSubmitting}
                    type="submit"
                  />
                </form>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>
    </FormProvider>
  );
};

interface QueryCallsResultProps {
  queryParams: PickQuerySchemaType;
}

const QueryCallsResult = ({ queryParams }: QueryCallsResultProps) => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );

  const {
    data: calls,
    isLoading: isLoadingCalls,
    isFetching: isFetchingCalls,
  } = useGetCall(session?.idToken ?? "", {
    ...queryParams,
    status: CallStatus.NEW,
  });

  if (
    isLoadingUser ||
    isLoadingCalls ||
    status === "loading" ||
    isFetchingCalls
  ) {
    return (
      <div className="flex min-h-screen flex-col place-items-center gap-10 ">
        <h1 className="text-center text-5xl text-white">Loading calls...</h1>
        <Lottie
          animationData={toolsAnimation}
          loop={true}
          className="max-w-xs"
        />
      </div>
    );
  }

  if (!calls || calls.length === 0) {
    return (
      <div className="flex min-h-screen flex-col place-items-center gap-10 ">
        <h1 className="text-center text-5xl text-white">Calls not found</h1>
        <Lottie
          animationData={noDataAnimation}
          loop={true}
          className="max-w-xs"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-stretch justify-center gap-4 px-2 ">
        {calls &&
          user &&
          calls
            .sort(sortByDate)
            .map((call) => (
              <CallCard
                key={call.id}
                isFetchingCalls={isFetchingCalls}
                call={call}
                fullSize={false}
                userRole={user.type}
                userId={user.id}
              />
            ))}
      </div>
    </>
  );
};

const DateLimitInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <label htmlFor="dateLimit" className="label">
        Date Limit
      </label>
      <input
        type="number"
        id="dateLimit"
        {...register("dateLimit", {
          setValueAs: (v: string) => (v === "" ? 0 : parseInt(v, 10)),
        })}
        defaultValue={0}
        className="input"
      />
      <ErrorMessage
        errors={errors}
        name="dateLimit"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </>
  );
};

export default Pick;
