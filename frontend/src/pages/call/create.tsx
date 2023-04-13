import { z } from "zod";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { NextPageWithAuth, UserRole } from "~/components/Auth";
import { useCities } from "~/api/cities";

const callSchema = z.object({
  service: z.string().min(1, { message: "Service is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

type callCreateFormSchema = z.infer<typeof callSchema>;

//TODO : implement
const onSubmit: SubmitHandler<callCreateFormSchema> = async (data) => {
  console.log(data);
};

const Create: NextPageWithAuth = () => {
  const formHook = useForm<callCreateFormSchema>({
    mode: "onChange",
    resolver: zodResolver(callSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  return (
    <div className=" grid justify-center gap-2 pt-2">
      <FormProvider {...formHook}>
        <Header />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" card grid max-w-lg  gap-2  "
        >
          <ServiceInput />
          <DescriptionInput />
          <div className="flex justify-between gap-2">
            <AddressInput />
            <CityInput />
          </div>

          <input
            className="rounded bg-yellow-400 py-2 px-4 font-bold text-white hover:bg-yellow-500"
            disabled={isSubmitting}
            type="submit"
            value="Create call"
          />
        </form>
      </FormProvider>
    </div>
  );
};

const Header: FC = () => {
  return (
    <div className="flex justify-center">
      <h1 className="text-5xl text-yellow-400">Create call</h1>
    </div>
  );
};

const ServiceInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<callCreateFormSchema>();

  return (
    <div>
      <label htmlFor="service" className="label">
        Service
      </label>
      <input
        className="input"
        {...register("service")}
        type="text"
        id="service"
      />
      <ErrorMessage
        errors={errors}
        name="service"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const DescriptionInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<callCreateFormSchema>();
  return (
    <div>
      <label htmlFor="description" className="label">
        Description
      </label>
      <textarea
        className="input h-40"
        {...register("description")}
        id="description"
      />
      <ErrorMessage
        errors={errors}
        name="description"
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
  } = useFormContext<callCreateFormSchema>();
  return (
    <div>
      <label htmlFor="address" className="label">
        Address
      </label>
      <input
        className="input"
        {...register("address")}
        type="text"
        id="address"
      />
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

  const { data: options } = useCities();

  return (
    <div>
      <label htmlFor="city" className="label">
        City
      </label>
      <select id="city" {...register("city")} className="input">
        {options &&
          options.map((city) => (
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

Create.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Create;
