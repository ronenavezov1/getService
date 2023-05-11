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
} from "react-hook-form";
import { z } from "zod";
import { UserRole } from "~/components/Auth";
import { usePostUser } from "~/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { CityInput } from "~/components/Inputs/CityInput";
import ProfessionInput from "~/components/Inputs/ProfessionInput";
import { MessageCardCentered } from "~/components/MessageCards";
import { toast } from "react-toastify";

const UserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phoneNumber: z.number().min(1, { message: "Phone number is required" }),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

const WorkerProviderSchema = UserSchema.extend({
  type: z.literal(UserRole.WORKER),
  profession: z.string().min(1, { message: "Profession is required" }),
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
        void router.push("/");
        void queryClient.invalidateQueries(["users"]);
        toast.success("User created successfully");
      },
    });
  };

  if (status === "loading") {
    return <MessageCardCentered message="Loading Session" />;
  }

  return (
    <div className="grid justify-center gap-2 pt-2">
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
          {userType === UserRole.WORKER && <ProfessionInput />}

          <input
            className="rounded bg-yellow-400 py-2 px-4 font-bold text-white hover:bg-yellow-500"
            disabled={isSubmitting}
            type="submit"
            value="Update profile"
          />
        </form>
      </FormProvider>
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
    register,
    formState: { errors },
  } = useFormContext();

  //Consist all options from Auth enum without ADMIN
  const options = Object.values(UserRole)
    .filter((value) => value !== UserRole.ADMIN)
    .map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ));

  return (
    <div>
      <label htmlFor="type" className="label">
        Type
      </label>
      <select id="type" defaultValue="" {...register("type")} className="input">
        <option value="" disabled hidden={true}>
          Select type
        </option>
        {options}
      </select>
      <ErrorMessage
        errors={errors}
        name="type"
        render={() => <p className=" p-1 text-xs text-red-600">Invalid type</p>}
      />
    </div>
  );
};

export default CompleteDetails;
