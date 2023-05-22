import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { type FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  useFormContext,
  type SubmitHandler,
  Controller,
} from "react-hook-form";
import { z } from "zod";
import { UserRole } from "~/components/Auth";
import { useGetUserByIdToken, usePostUser } from "~/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { CityInput } from "~/components/Inputs/CityInput";
import { ProfessionInputMultiple } from "~/components/Inputs/ProfessionInput";
import { MessageCardCentered } from "~/components/MessageCards";
import { toast } from "react-toastify";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const UserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z.number().min(1, { message: "Phone number is required" }),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

const WorkerProviderSchema = UserSchema.extend({
  type: z.literal(UserRole.WORKER),
  profession: z.array(z.string()).min(1, { message: "Profession is required" }),
});

const CustomerSchema = UserSchema.extend({
  type: z.literal(UserRole.CUSTOMER),
});

const compeleteDetailsFormSchema = z.discriminatedUnion("type", [
  WorkerProviderSchema,
  CustomerSchema,
]);

export type CompeleteDetailsFormSchemaType = z.infer<
  typeof compeleteDetailsFormSchema
>;

//////////////////////////////////////////////////////////////

const CompleteDetails: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: user, isLoading: isLoadingUser } = useGetUserByIdToken(
    session?.idToken ?? ""
  );
  const queryClient = useQueryClient();
  const { mutate } = usePostUser(session?.idToken ?? "");
  const formHook = useForm<CompeleteDetailsFormSchemaType>({
    mode: "onChange",
    resolver: zodResolver(compeleteDetailsFormSchema),
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = formHook;
  const userType = watch("type");

  /**
   * Submits form data , invalidates user query and redirects to home page
   */
  const onSubmitHandler: SubmitHandler<CompeleteDetailsFormSchemaType> = (
    data
  ) => {
    mutate(data, {
      onSuccess: () => {
        toast.onChange((payload) => {
          switch (payload.status) {
            case "removed":
              // toast has been removed
              void queryClient.invalidateQueries(["user"]);
              break;
          }
        });
        toast.success("User created successfully");
      },
    });
  };

  if (status === "loading" || isLoadingUser) {
    return <MessageCardCentered message="Loading Session" />;
  }

  if (!!user?.isOnBoardingCompleted) {
    void router.push("/");
    return null;
  }

  return (
    <div className="bodyDiv">
      <div className="grid justify-center gap-2 ">
        <FormProvider {...formHook}>
          <Header />
          <form
            onSubmit={handleSubmit(onSubmitHandler)}
            className=" card grid max-w-lg  gap-2  "
          >
            <div className="flex justify-between gap-2">
              <FirstNameInput />
              <LastNameInput />
            </div>
            <PhoneInput />
            <div className="flex justify-between gap-2">
              <AddressInput />
              <div>
                <CityInput />
              </div>
            </div>
            <TypeInput />
            {userType === UserRole.WORKER && <ProfessionInputMultiple />}

            <input
              className="mt-2 rounded bg-yellow-400 py-2 px-4 font-bold text-white hover:bg-yellow-500"
              disabled={isSubmitting}
              type="submit"
              value="Update profile"
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

const Header: FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-5xl text-yellow-400">GetService</h1>
      <h1 className="text-xl  text-white">Fill in the information</h1>
    </div>
  );
};

const FirstNameInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

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
      <ErrorMessage
        errors={errors}
        name="firstName"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const LastNameInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="lastName" className="label">
        Last Name
      </label>
      <input id="lastName" {...register("lastName")} className="input" />
      <ErrorMessage
        errors={errors}
        name="lastName"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const PhoneInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="phone" className="label">
        Phone
      </label>
      <input
        id="phone"
        {...register("phoneNumber", { valueAsNumber: true })}
        className="input"
        type="number"
      />
      <ErrorMessage
        errors={errors}
        name="phone"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const AddressInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="address" className="label">
        Address
      </label>
      <input id="address" {...register("address")} className="input" />
      <ErrorMessage
        errors={errors}
        name="address"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const TypeInput: FC = () => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  const options = Object.values(UserRole)
    .filter((value) => value !== UserRole.ADMIN)
    .map((value) => (
      <Listbox.Option
        key={value}
        value={value}
        className={({ active }) =>
          `  cursor-default select-none py-2 pl-10 pr-4 ${
            active ? "bg-blue-500 text-white" : "text-gray-900"
          }`
        }
      >
        {value}
      </Listbox.Option>
    ));

  return (
    <div>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange } }) => (
          <Listbox onChange={onChange}>
            <Listbox.Label className="label ">Type</Listbox.Label>
            <div className="relative mt-1 w-full cursor-default ">
              <Listbox.Button className="input bg-white">
                {getValues("type") ?? "Select type"}
                <div className="absolute right-0 top-0 mt-2 ">
                  <ChevronUpDownIcon
                    className="h-5 w-5 fill-indigo-500 "
                    aria-hidden="true"
                  />
                </div>
              </Listbox.Button>
              <Listbox.Options className="comboboxOptions ">
                {options}
              </Listbox.Options>
            </div>
          </Listbox>
        )}
      />

      <ErrorMessage
        errors={errors}
        name="type"
        render={() => <p className=" p-1 text-xs text-red-600">Invalid type</p>}
      />
    </div>
  );
};

export default CompleteDetails;
