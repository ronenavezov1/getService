import { z } from "zod";
import {
  FormProvider,
  type SubmitHandler,
  useForm,
  useFormContext,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { CityInput } from "./Inputs/CityInput";
import { useSession } from "next-auth/react";
import { useGetUserByIdToken } from "~/api/user";
import { useRouter } from "next/router";
import {
  type Call,
  useCreateCall,
  usePutCall,
  ExpectedArrivalTimeSlots,
} from "~/api/call";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MessageCard } from "./MessageCards";
import ProfessionInput from "./Inputs/ProfessionInput";
import DatePicker from "react-datepicker";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

const callSchema = z.object({
  customerId: z.string().optional(),
  profession: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }),
  city: z.string().min(1, { message: "Required" }),
  address: z.string().min(1, { message: "Required" }),
  expectedArrivalDate: z.coerce.date(),
  expectedArrivalTime: z.nativeEnum(ExpectedArrivalTimeSlots),
});

export type callCreateFormSchema = z.infer<typeof callSchema>;

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
    return <MessageCard message="loading" />;
  }

  const onCreateSubmit: SubmitHandler<callCreateFormSchema> = (data) => {
    mutateCreateCall(data, {
      onSuccess: () => {
        toast.onChange((payload) => {
          switch (payload.status) {
            case "added":
              // new toast added
              break;
            case "updated":
              // toast updated
              break;
            case "removed":
              // toast has been removed
              void router.push("/call");
              void queryClient.invalidateQueries(["call"]);
              break;
          }
        });

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
          <ProfessionInput />
          <DescriptionInput />
          <div className="flex justify-between gap-2">
            <div>
              <AddressInput />
            </div>
            <div>
              <CityInput />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <ExpectedArrivalDateInput />
            <ExpectedArrivalTimeInput />
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

const ExpectedArrivalDateInput: FC = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<callCreateFormSchema>();
  return (
    <div className="w-full">
      <Controller
        control={control}
        name="expectedArrivalDate"
        render={({ field: { onChange } }) => (
          <>
            <label htmlFor="expectedArrivalDate" className="label">
              Arrival Date
            </label>
            <div className="relative mt-1 w-full cursor-default ">
              <DatePicker
                id="expectedArrivalDate"
                selected={watch("expectedArrivalDate")}
                placeholderText="Select Date"
                onChange={onChange}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                preventOpenOnFocus={true}
                className="input text-center"
              />
              <label
                htmlFor="expectedArrivalDate"
                className="absolute right-0 top-0 mt-2 "
              >
                <ChevronUpDownIcon
                  className="h-5 w-5 fill-indigo-500 "
                  aria-hidden="true"
                />
              </label>
            </div>
          </>
        )}
      />
      <ErrorMessage
        errors={errors}
        name="expectedArrivalDate"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

const ExpectedArrivalTimeInput = () => {
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();

  const options = Object.values(ExpectedArrivalTimeSlots).map((value) => (
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
    <div className="w-full ">
      <Controller
        control={control}
        name="expectedArrivalTime"
        render={({ field: { onChange } }) => (
          <Listbox
            onChange={onChange}
            as={"div"}
            className="w-full"
            defaultValue={getValues("expectedArrivalTime") ?? "Select time"}
          >
            <Listbox.Label className="label ">Arrival Time</Listbox.Label>
            <div className="relative mt-1 w-full  cursor-default ">
              <Listbox.Button
                className="input bg-white"
                placeholder="Select Time"
              >
                {getValues("expectedArrivalTime") ?? (
                  <span className="text-gray-400">Select Time</span>
                )}
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
        name="expectedArrivalTime"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

interface EditCallFormProps {
  call: Call;
  isFetchingCalls: boolean;
  closeModal: () => void;
}

export const EditCallForm: FC<EditCallFormProps> = ({
  call,
  closeModal,
  isFetchingCalls,
}) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const { mutate } = usePutCall(session?.idToken ?? "", call.id);

  const formHook = useForm<callCreateFormSchema>({
    mode: "onChange",
    resolver: zodResolver(callSchema),
    defaultValues: {
      address: call.address,
      city: call.city,
      description: call.description,
      profession: call.profession,
      expectedArrivalTime: call.expectedArrivalTime,
      expectedArrivalDate: new Date(call.expectedArrivalDate),
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  if (status === "loading") {
    return <MessageCard message="Loading Call" />;
  }

  const onSubmit: SubmitHandler<callCreateFormSchema> = (data) => {
    mutate(data, {
      onSuccess: () => {
        void queryClient.invalidateQueries(["call"]);
        closeModal();
        toast.success("Call updated successfully");
      },
    });
  };

  const isDisabled = isSubmitting || isFetchingCalls;

  return (
    <>
      <FormProvider {...formHook}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="  grid max-w-lg  gap-2  "
        >
          <ProfessionInput />
          <DescriptionInput />
          <div className="flex justify-between gap-2">
            <div>
              <AddressInput />
            </div>
            <div>
              <CityInput />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <ExpectedArrivalDateInput />
            <ExpectedArrivalTimeInput />
          </div>

          <input
            className="rounded bg-yellow-400 py-2 px-4 font-bold text-white hover:bg-yellow-500"
            disabled={isDisabled}
            type="submit"
          />
        </form>
      </FormProvider>
    </>
  );
};

// const ProfessionInput: FC = () => {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext<callCreateFormSchema>();

//   return (
//     <div>
//       <label htmlFor="profession" className="label capitalize">
//         profession
//       </label>
//       <input
//         className="input"
//         {...register("profession")}
//         type="text"
//         id="profession"
//       />
//       <ErrorMessage
//         errors={errors}
//         name="profession"
//         render={({ message }) => (
//           <p className=" pt-1 text-xs text-red-600">{message}</p>
//         )}
//       />
//     </div>
//   );
// };

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
