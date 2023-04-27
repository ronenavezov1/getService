import { z } from "zod";
import {
  FormProvider,
  type SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useCities } from "~/api/cities";
import { useSession } from "next-auth/react";
import { CityInput } from "./Inputs/CityInput";

const callSchema = z.object({
  service: z.string().min(1, { message: "Service is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

export type callCreateFormSchema = z.infer<typeof callSchema>;

interface CallFormProps {
  onSubmit: SubmitHandler<callCreateFormSchema>;
  defaultValues?: callCreateFormSchema;
}

export const CallForm: FC<CallFormProps> = ({ onSubmit, defaultValues }) => {
  const formHook = useForm<callCreateFormSchema>({
    mode: "onChange",
    resolver: zodResolver(callSchema),
    defaultValues: defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;
  const { data: session } = useSession({ required: true });
  const { data: cities } = useCities(session?.idToken ?? "");

  return (
    <>
      <FormProvider {...formHook}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" card grid max-w-lg  gap-2  "
        >
          <ServiceInput />
          <DescriptionInput />
          <div className="flex justify-between gap-2">
            <AddressInput />
            <CityInput cities={cities} />
          </div>

          <input
            className="rounded bg-yellow-400 py-2 px-4 font-bold text-white hover:bg-yellow-500"
            disabled={isSubmitting}
            type="submit"
          />
        </form>
      </FormProvider>
    </>
  );
};

// const Header: FC = () => {
//   return (
//     <div className="flex justify-center">
//       <h1 className="text-5xl text-yellow-400">Create call</h1>
//     </div>
//   );
// };

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
        className="input h-48"
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
