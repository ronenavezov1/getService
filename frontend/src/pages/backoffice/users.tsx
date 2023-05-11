/* eslint-disable */

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
// import { useGetUsers } from "~/api/user";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { MessageCard } from "~/components/MessageCards";
import UserCard from "~/components/UserCard";

const UsersQuerySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isApproved: z.boolean().optional(),
  isCompletedOnBoarding: z.boolean().optional(),
});

type UsersQuerySchemaType = z.infer<typeof UsersQuerySchema>;

const defaultUsersQueryParams = {};

const Users: NextPageWithAuth = () => {
  const [usersQueryParams, setUsersQueryParams] =
    useState<UsersQuerySchemaType>(defaultUsersQueryParams);

  return (
    <div className="flex flex-col items-center gap-4 p-2">
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
    formState: { isSubmitting },
  } = formHook;

  const onSubmit: SubmitHandler<UsersQuerySchemaType> = (data) => {
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
            <Disclosure.Panel className="w-full  max-w-2xl text-gray-500">
              <form
                onSubmit={handleSubmit(() => {
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
                  <IsCompletedOnBoardingInput />
                </div>

                <input
                  className="w-full  rounded bg-yellow-400 p-2 font-bold text-white hover:bg-yellow-500"
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

  if (isLoadingUsers || status === "loading") {
    return <MessageCard message="Loading users..." />;
  }

  return (
    <>
      <div className="flex flex-wrap items-stretch justify-center gap-4 px-2 py-4">
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
      <input id="isApproved" type="checkbox" {...register("isApproved")} />
    </div>
  );
};

const IsCompletedOnBoardingInput: FC = () => {
  const { register } = useFormContext();

  return (
    <div className="flex gap-2">
      <label className="label" htmlFor="isCompletedOnBoarding">
        Completed on boarding
      </label>
      <input
        id="isCompletedOnBoarding"
        type="checkbox"
        {...register("isCompletedOnBoarding")}
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
      <input
        id="firstName"
        {...register("firstName", { required: "First name is required " })}
        className="input"
      />
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
