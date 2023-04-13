import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import type { SubmitHandler } from "react-hook-form/dist/types";

const UserSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  phone: z.number().min(1, { message: "Phone number is required" }),
  city: z.number().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

const ServiceProviderSchema = UserSchema.extend({
  type: z.literal("serviceProvider"),
  profession: z.string().min(1, { message: "Profession is required" }),
});

const CustomerSchema = UserSchema.extend({
  type: z.literal("customer"),
});

const compeleteDetailsFormSchema = z.discriminatedUnion("type", [
  ServiceProviderSchema,
  CustomerSchema,
]);

//TODO: implement this
const onSubmit: SubmitHandler<compeleteDetailsFormSchemaType> = async (
  data
) => {
  const test = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.phone}`);
  const res = await test.json();
  console.log("res", res);

  // const res = await fetch("/api/user", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${session?.accessToken}
  //   },
  //   body: JSON.stringify(data),
  // });

  // await router.push("/");
};

type compeleteDetailsFormSchemaType = z.infer<
  typeof compeleteDetailsFormSchema
>;

const completeDetails = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });
  const formHook = useForm<compeleteDetailsFormSchemaType>({
    mode: "onChange",
    resolver: zodResolver(compeleteDetailsFormSchema),
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = formHook;
  const userType = watch("type");

  return (
    <div className="grid justify-center gap-2 pt-2">
      <FormProvider {...formHook}>
        <Header />
        <form
          onSubmit={handleSubmit(onSubmit)}
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
          {userType === "serviceProvider" && <ProfessionInput />}

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
      <h1 className="text-xl  text-white"> Fill in the information </h1>
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

  return (
    <div>
      <label htmlFor="city" className="label">
        City
      </label>
      <input
        id="city"
        {...register("city", { valueAsNumber: true })}
        className="input"
      />
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

  //Consist all option, could be implemented with fetching from db in future
  const options = [
    { value: "customer", label: "Customer" },
    { value: "serviceProvider", label: "Service Provider" },
  ];

  return (
    <div>
      <label htmlFor="type" className="label">
        Type
      </label>
      <select id="type" {...register("type")} className="input">
        <option value="" selected hidden>
          Select type
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ErrorMessage
        errors={errors}
        name="type"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">Invalid type</p>
        )}
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
