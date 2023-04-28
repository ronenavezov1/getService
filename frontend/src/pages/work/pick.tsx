import { Disclosure } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { type } from "os";
import { type FC } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { z } from "zod";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import CityInput from "~/components/Inputs/CityInput";
import ProfessionInput from "~/components/Inputs/ProfessionInput";

const Pick: NextPageWithAuth = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-2">
      <PickQuery />

      <div>pick</div>
    </div>
  );
};

Pick.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.WORKER],
};

const PickQuerySchema = z.object({
  profession: z.string().optional(),
  city: z.string().optional(),
  dateLimit: z.coerce.number(), //sets 0 if empty
});

type PickQuerySchemaType = z.infer<typeof PickQuerySchema>;

const PickQuery: FC = () => {
  const formHook = useForm<PickQuerySchemaType>({
    mode: "onChange",
    resolver: zodResolver(PickQuerySchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  //TODO COMPLETE WITH CALL TO API
  const onSubmit: SubmitHandler<PickQuerySchemaType> = (data) => {
    console.log(data);
  };

  return (
    <FormProvider {...formHook}>
      <Disclosure>
        {({ close, open }) => (
          <>
            <Disclosure.Button
              className={`
            ${
              open
                ? "bg-indigo-700 text-yellow-500"
                : "bg-indigo-600 text-white"
            }
            flex  w-full max-w-2xl gap-2  rounded-xl  p-2  text-sm font-bold  hover:bg-indigo-700`}
            >
              <div className="grow">sort</div>
              <ChevronLeftIcon
                className={`${open ? "-rotate-90 transform" : ""}  h-5 `}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-500">
              <form
                onSubmit={handleSubmit(() => {
                  onSubmit(formHook.getValues());
                  close();
                })}
                className="card"
              >
                <div className=" flex flex-wrap gap-1 ">
                  <div className="grow">
                    <ProfessionInput />
                  </div>
                  <div className="grow">
                    <CityInput />
                  </div>
                  <div className="grow">
                    <DateLimitInput />
                  </div>
                </div>

                <input
                  className="mt-2   rounded bg-yellow-400 py-2 px-4 font-bold text-white hover:bg-yellow-500"
                  disabled={isSubmitting}
                  type="submit"
                  value="Update profile"
                />
              </form>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </FormProvider>
  );
};

const DateLimitInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <label htmlFor="dateLimit" className="label">
        Date Limit
      </label>
      <input
        type="number"
        id="dateLimit"
        {...register("dateLimit", {
          setValueAs: (v) => (v === "" ? 0 : parseInt(v, 10)),
        })}
        defaultValue={0}
        className="input"
      />
      <ErrorMessage
        errors={errors}
        name="dateLimit"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </>
  );
};

export default Pick;
