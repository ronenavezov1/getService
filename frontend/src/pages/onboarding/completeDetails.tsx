import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { type FC, useState, Fragment } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  useForm,
  useFormContext,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { UserRole } from "~/components/Auth";
import { useCities } from "~/api/cities";
import { usePostUser } from "~/api/user";
import { useQueryClient } from "@tanstack/react-query";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const UserSchema = z.object({
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

export type CompeleteDetailsFormSchemaType = z.infer<
  typeof compeleteDetailsFormSchema
>;

//////////////////////////////////////////////////////////////

const CompleteDetails: FC = () => {
  const router = useRouter();
  const { data: session } = useSession({ required: true });
  const queryClient = useQueryClient();
  const { mutate } = usePostUser();
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

  const { data: cities } = useCities(session?.idToken ?? "");

  /**
   * Submits form data , invalidates user query and redirects to home page
   */
  const onSubmitHandler: SubmitHandler<CompeleteDetailsFormSchemaType> = async (
    data
  ) => {
    mutate(data, {
      onSuccess: () => {
        void queryClient.invalidateQueries(["user"]);
      },
    });
    await router.push("/");
  };

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
            <CityInput cities={cities} />
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

const CityInput: FC<CityInputProps> = ({ cities }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [query, setQuery] = useState("");

  const filteredCities =
    (query && cities?.length !== 0) === ""
      ? cities
      : cities?.filter((city: City) =>
          city.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange } }) => (
          <Combobox onChange={onChange}>
            <Combobox.Label className={"label"}>City</Combobox.Label>
            <div className="relative mt-1 cursor-default ">
              <Combobox.Input
                placeholder="Select city"
                className="input"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />

              <Combobox.Button className="absolute right-0 h-full pr-2 ">
                <ChevronUpDownIcon
                  className="h-5 w-5 fill-indigo-500 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="comboboxOptions">
                  {filteredCities?.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredCities?.map((city: City) => (
                      <Combobox.Option
                        className={({ active }) =>
                          `relative  cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                        key={city.name}
                        value={city.name}
                      >
                        {city.name}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        )}
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

export default CompleteDetails;
