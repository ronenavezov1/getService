import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import type { SubmitHandler } from "react-hook-form/dist/types";
import { UserRole } from "~/components/Auth";
import { useUser, useUserBySession } from "~/api/users";
import { useCities } from "~/api/cities";

const UserSchema = z.object({
  id: z.string(), //TODO: what id?
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.number().min(1, { message: "Phone number is required" }),
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

export type CustomerSchemaType = z.infer<typeof CustomerSchema>;
export type WorkerSchemaType = z.infer<typeof WorkerProviderSchema>;

type compeleteDetailsFormSchemaType = z.infer<
  typeof compeleteDetailsFormSchema
>;

type UserSchemaType = z.infer<typeof UserSchema>;

//////////////////////////////////////////////////////////////

const completeDetails = () => {
  const { data: session, status } = useSession({ required: true });
  const formHook = useForm<compeleteDetailsFormSchemaType>({
    // defaultValues: async () => {
    //   const user = await useUserBySession();
    //   return user as UserSchemaType;
    // },
    mode: "onChange",
    resolver: zodResolver(compeleteDetailsFormSchema),
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = formHook;
  const userType = watch("type");

  const onSubmitHandler = (data: any) => {
    console.log(data);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
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
          <AddressInput />
          <CityInput />
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
        {...register("phone", { valueAsNumber: true })}
        className="input"
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

const CityInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const { data: cities } = useCities();

  return (
    <div>
      <label htmlFor="city" className="label">
        City
      </label>
      <select id="city" defaultValue="" {...register("city")} className="input">
        <option value="" hidden>
          Select city
        </option>
        {cities &&
          cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
      </select>
      <ErrorMessage
        errors={errors}
        name="city"
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
        <option value="" hidden={true}>
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

const ProfessionInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="profession" className="label">
        Profession
      </label>
      <input
        id="profession"
        {...register("profession", { shouldUnregister: true })}
        className="input"
      />
      <ErrorMessage
        errors={errors}
        name="profession"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

export default completeDetails;
