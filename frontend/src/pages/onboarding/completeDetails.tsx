import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form/dist/types";

const completeDetails = () => {
  const ServiceProviderSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phone: z.number().min(1, { message: "Phone number is required" }),
    city: z.number().min(1, { message: "City is required" }),
    address: z.string().min(1, { message: "Adress is required" }),
    type: z.literal("serviceProvider"),
    profession: z.string().min(1, { message: "Profession is required" }),
  });

  const CustomerSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phone: z.number().min(1, { message: "Phone number is required" }),
    city: z.number().min(1, { message: "City is required" }),
    address: z.string().min(1, { message: "Adress is required" }),
    type: z.literal("customer"),
  });

  const AdminSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phone: z.number().min(1, { message: "Phone number is required" }),
    city: z.number().min(1, { message: "City is required" }),
    address: z.string().min(1, { message: "Adress is required" }),
    type: z.literal("admin"),
  });

  //TODO: admin schema???

  const formSchema = z.discriminatedUnion("type", [
    ServiceProviderSchema,
    CustomerSchema,
    AdminSchema,
  ]);

  //TODO: fix Invalid discriminator value. Expected 'serviceProvider' | 'customer' | 'admin' in type

  type formSchemaType = z.infer<typeof formSchema>;

  const router = useRouter();
  const { data: session } = useSession();
  const formHook = useForm<formSchemaType>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = formHook;

  const userType = watch("type");

  //TODO: implement this
  const onSubmit: SubmitHandler<formSchemaType> = async (data) => {
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

  return (
    <FormProvider {...formHook}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container m-auto grid max-w-lg  gap-4 p-4  "
      >
        <Header />

        <div className="flex justify-between">
          <FirstNameInput />
          <LastNameInput />
        </div>

        <PhoneInput />
        <AddressInput />
        <CityInput />
        <TypeInput />
        {userType === "serviceProvider" && <ProfessionInput />}

        <div>
          <input
            className="m-auto flex"
            disabled={isSubmitting}
            type="submit"
            value="Update profile"
          />
        </div>
      </form>
    </FormProvider>
  );
};

const Header: FC = () => {
  return (
    <div className="text-center">
      <h1 className=" text-xl ">Welcome</h1>
      <h2>Please fill in the information</h2>
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
      <label
        htmlFor="firstName"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        First Name
      </label>
      <input
        id="firstName"
        {...register("firstName", { required: "First name is required " })}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="firstName"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
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
      <label
        htmlFor="lastName"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        Last Name
      </label>
      <input
        id="lastName"
        {...register("lastName")}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="lastName"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
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
      <label
        htmlFor="phone"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        Phone
      </label>
      <input
        id="phone"
        {...register("phone")}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="phone"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const IdInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label
        htmlFor="id"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        ID number
      </label>
      <input
        id="id"
        {...register("id")}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="id"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
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
      <label
        htmlFor="address"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        Address
      </label>
      <input
        id="address"
        {...register("address")}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="address"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
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
      <label
        htmlFor="city"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        City
      </label>
      <input
        id="city"
        {...register("city")}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="city"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
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
    { value: "admin", label: "Admin" },
  ];

  return (
    <div>
      <label
        htmlFor="type"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        Type
      </label>
      <select
        id="type"
        {...register("type")}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      >
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
      <label
        htmlFor="profession"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        Profession
      </label>
      <input
        id="profession"
        {...register("profession", { shouldUnregister: true })}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="profession"
        render={({ message }) => (
          <p className=" p-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

export default completeDetails;
