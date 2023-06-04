import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
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
import { useGetUsers } from "~/api/users";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import UserCard from "~/components/UserCard";
import toolsAnimation from "public/lottie/95851-tools.json";
import noDataAnimation from "public/lottie/107420-no-data-loader.json";
import Lottie from "lottie-react";

const UsersQuerySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isApproved: z.boolean().optional(),
  isOnBoardingCompleted: z.boolean().optional(),
});

type UsersQuerySchemaType = z.infer<typeof UsersQuerySchema>;

const defaultEmptyUsersQueryParams = {};

const Users: NextPageWithAuth = () => {
  const [usersQueryParams, setUsersQueryParams] =
    useState<UsersQuerySchemaType>(defaultEmptyUsersQueryParams);

  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <UsersQuery setQueryParams={setUsersQueryParams} />
      <QueryUsersResult queryParams={usersQueryParams} />
    </div>
  );
};

interface UsersQueryProps {
  setQueryParams: Dispatch<SetStateAction<UsersQuerySchemaType>>;
}

const UsersQuery = ({ setQueryParams }: UsersQueryProps) => {
  const formHook = useForm<UsersQuerySchemaType>({
    resolver: zodResolver(UsersQuerySchema),
  });

  const {
    handleSubmit,
    unregister,
    formState: { isSubmitting },
  } = formHook;

  const onSubmit: SubmitHandler<UsersQuerySchemaType> = (data) => {
    setQueryParams(data);
  };

  /**
   * Unregister empty names to avoid sending them to the server
   */
  const unRegisterEmptyNames = () => {
    const currentValues = formHook.getValues();

    if (currentValues.firstName === "") unregister("firstName");
    if (currentValues.lastName === "") unregister("lastName");
  };

  const isDisabled = isSubmitting;

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
                    unRegisterEmptyNames();
                    onSubmit(formHook.getValues());
                    close();
                  })}
                  className="card grid gap-2"
                >
                  <div className=" flex flex-wrap gap-1 ">
                    <div className="grow">
                      <FirstNameInput />
                    </div>
                    <div className="grow">
                      <LastNameInput />
                    </div>
                  </div>

                  <div className="flex justify-evenly">
                    <IsApprovedInput />
                    <IsOnBoardingCompletedInput />
                  </div>

                  <input
                    className="w-full  rounded bg-yellow-400 p-2 font-bold text-white hover:bg-yellow-500 disabled:bg-yellow-500"
                    disabled={isDisabled}
                    type="submit"
                    value="Search"
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

interface QueryUsersResultProps {
  queryParams: UsersQuerySchemaType;
}

const QueryUsersResult = ({ queryParams }: QueryUsersResultProps) => {
  const { data: session, status } = useSession();

  const {
    data: users,
    isLoading: isLoadingUsers,
    isFetching,
  } = useGetUsers(session?.idToken ?? "", {
    ...queryParams,
  });

  if (isLoadingUsers || status === "loading" || isFetching) {
    return (
      <Lottie
        animationData={toolsAnimation}
        loop={true}
        className="max-w-[12rem]"
      />
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex min-h-screen flex-col place-items-center gap-10 ">
        <h1 className="text-center text-5xl text-white">No users found</h1>
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
        {users &&
          users.map((user) => (
            <UserCard key={user.id} user={user} isFetchingCalls={isFetching} />
          ))}
      </div>
    </>
  );
};

const IsApprovedInput: FC = () => {
  const { register } = useFormContext();

  return (
    <div className="flex gap-2 ">
      <label className="label" htmlFor="isApproved">
        Approved
      </label>
      <input
        id="isApproved"
        type="checkbox"
        defaultChecked={true}
        {...register("isApproved")}
      />
    </div>
  );
};

const IsOnBoardingCompletedInput: FC = () => {
  const { register } = useFormContext();

  return (
    <div className="flex gap-2">
      <label className="label" htmlFor="isOnBoardingCompleted">
        Completed on boarding
      </label>
      <input
        id="isOnBoardingCompleted"
        type="checkbox"
        defaultChecked={true}
        {...register("isOnBoardingCompleted")}
      />
    </div>
  );
};

const FirstNameInput: FC = () => {
  const { register } = useFormContext();

  return (
    <div>
      <label htmlFor="firstName" className="label">
        First Name
      </label>
      <input id="firstName" {...register("firstName")} className="input" />
    </div>
  );
};

const LastNameInput: FC = () => {
  const { register } = useFormContext();

  return (
    <div>
      <label htmlFor="lastName" className="label">
        Last Name
      </label>
      <input id="lastName" {...register("lastName")} className="input" />
    </div>
  );
};

Users.auth = {
  requiredRoles: [UserRole.ADMIN],
};

export default Users;
