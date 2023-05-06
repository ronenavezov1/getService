import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

import { type FC } from "react";
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

const Pick: NextPageWithAuth = () => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );
  const {
    data: calls,
    isLoading: isLoadingSession,
    isFetching,
  } = useGetCall(session?.idToken ?? "", {
    status: CallStatus.NEW,
  });

  if (isLoadingSession || isLoadingUser || status === "loading")
    return <div>loading...</div>;

  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <PickQuery />
      {calls && user && (
        <div className="flex flex-wrap items-stretch justify-center  gap-4 px-2 py-4">
          {calls.sort(sortByDate).map((call) => (
            <CallCard
              key={call.id}
              isFetchingCalls={isFetching}
              call={call}
              fullSize={false}
              userRole={user.type}
              userId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Pick.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.WORKER],
};

const PickQuerySchema = z.object({
  profession: z.string().optional(),
  city: z.string().optional(),
  dateLimit: z.number(), //TODO: sets 0 if empty
});

type PickQuerySchemaType = z.infer<typeof PickQuerySchema>;

const PickQuery: FC = () => {
  const formHook = useForm<PickQuerySchemaType>({
    mode: "onChange",
    resolver: zodResolver(PickQuerySchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  //TODO COMPLETE WITH CALL TO API
  const onSubmit: SubmitHandler<PickQuerySchemaType> = (data) => {
    console.log(data);
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
              <div className="grow">sort</div>
              <ChevronLeftIcon
                className={`${open ? "-rotate-90 transform" : ""}   h-5 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
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
                  value="Search"
                />
              </form>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </FormProvider>
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
