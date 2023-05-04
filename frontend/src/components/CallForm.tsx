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
import { CityInput } from "./Inputs/CityInput";
import { useSession } from "next-auth/react";
import { useGetUserByIdToken } from "~/api/user";
import { useRouter } from "next/router";
import { type Call, useCreateCall, useGetCall, usePutCall } from "~/api/call";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MessageCard } from "./MessageCards";

const callSchema = z.object({
  customerId: z.string(),
  service: z.string().min(1, { message: "Service is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

export type callCreateFormSchema = z.infer<typeof callSchema>;

interface EditCallFormProps {
  callId: string;
}

export const CreateCallForm: FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: user, isLoading } = useGetUserByIdToken(session?.idToken ?? "");
  const queryClient = useQueryClient();
  const { mutate: mutateCreateCall } = useCreateCall(session?.idToken ?? "");

  const formHook = useForm<callCreateFormSchema>({
    mode: "onChange",
    resolver: zodResolver(callSchema),
    defaultValues: { customerId: user?.id ?? "" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  if (isLoading || status === "loading") {
    return null;
  }

  const onCreateSubmit: SubmitHandler<callCreateFormSchema> = (data) => {
    mutateCreateCall(data, {
      onSuccess: () => {
        void router.push("/call");
        void queryClient.invalidateQueries(["call"]);
        toast.success("Call created successfully");
      },
    });
  };

  return (
    <>
      <FormProvider {...formHook}>
        <form
          onSubmit={handleSubmit(onCreateSubmit)}
          className=" card grid max-w-lg  gap-2  "
        >
          <ServiceInput />
          <DescriptionInput />
          <div className="flex justify-between gap-2">
            <div>
              <AddressInput />
            </div>
            <div>
              <CityInput />
            </div>
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

export const EditCallForm: FC<EditCallFormProps> = ({ callId }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { data: calls, isLoading: isLoadingCall } = useGetCall(
    session?.idToken ?? "",
    {
      id: callId,
    }
  );

  const { mutate } = usePutCall(session?.idToken ?? "", callId);

  const formHook = useForm<callCreateFormSchema>({
    mode: "onChange",
    resolver: zodResolver(callSchema),
    defaultValues: calls?.[0],
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  if (isLoadingCall || status === "loading") {
    return <MessageCard message="Loading Call" />;
  }

  const onSubmit = (data: callCreateFormSchema) => {
    console.log(formHook.formState.dirtyFields);
    mutate(data, {
      onSuccess: () => {
        void router.push("/call");
        void queryClient.invalidateQueries(["call"]);
        toast.success("Call updated successfully");
      },
    });
  };

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
            <div>
              <AddressInput />
            </div>
            <div>
              <CityInput />
            </div>
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
    <>
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
    </>
  );
};
