import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { MessageCard } from "~/components/MessageCards";
import { sortByDate } from "~/utils/sortUtils";

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
    <div className="flex flex-col items-center gap-4 p-2">
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
            flex  w-full max-w-2xl gap-2  rounded-xl  p-2  text-sm font-bold  hover:bg-indigo-700`}
            >
              <div className="grow">Search</div>
              <ChevronLeftIcon
                className={`${open ? "-rotate-90 transform" : ""}   h-5 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="w-full max-w-2xl text-gray-500">
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

  if (isLoadingUser || isLoadingCalls || status === "loading") {
    return <MessageCard message="Loading calls..." />;
  }

  return (
    <>
      <div className="flex flex-wrap items-stretch justify-center gap-4 px-2 py-4">
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
