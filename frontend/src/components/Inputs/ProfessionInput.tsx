import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { Fragment, type FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Profession, useGetProfessions } from "~/api/professions";

export const ProfessionInput: FC = () => {
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { data: professions } = useGetProfessions(session?.idToken ?? "");
  const [query, setQuery] = useState("");

  return (
    <>
      <Controller
        control={control}
        name="profession"
        render={({ field: { onChange } }) => (
          <Combobox
            onChange={onChange}
            defaultValue={getValues("profession") as string}
          >
            <Combobox.Label className={"label"}>profession</Combobox.Label>
            <div className="relative  -mt-1 w-full cursor-default ">
              <Combobox.Input
                placeholder="Select Profession"
                className="input"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />

              <Combobox.Button className="absolute right-0  h-full pr-2 ">
                <ChevronUpDownIcon
                  className="h-5 w-5 fill-indigo-500 "
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
                <Combobox.Options className="comboboxOptions ">
                  {professions?.length === 0 ? (
                    <div className=" cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    professions?.map((city: Profession) => (
                      <Combobox.Option
                        className={({ active }) =>
                          `  cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                        key={city.value}
                        value={city.value}
                      >
                        {city.value}
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
        name="profession"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </>
  );
};

export const ProfessionInputMultiple: FC = () => {
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { data: professions } = useGetProfessions(session?.idToken ?? "");
  const [query, setQuery] = useState("");

  return (
    <>
      <Controller
        control={control}
        name="profession"
        render={({ field: { onChange } }) => (
          <Combobox
            onChange={onChange}
            defaultValue={getValues("profession") as string}
            multiple
          >
            <Combobox.Label className={"label"}>profession</Combobox.Label>
            <div className="relative z-10 -mt-1 w-full cursor-default ">
              <Combobox.Input
                placeholder="Select Profession"
                className="input"
                displayValue={(value: any) => value.join(", ")}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />

              <Combobox.Button className="absolute right-0  h-full pr-2 ">
                <ChevronUpDownIcon
                  className="h-5 w-5 fill-indigo-500 "
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
                <Combobox.Options className="comboboxOptions ">
                  {professions?.length === 0 ? (
                    <div className=" cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    professions?.map((city: Profession) => (
                      <Combobox.Option
                        className={({ active }) =>
                          `  cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                        key={city.value}
                        value={city.value}
                      >
                        {city.value}
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
        name="profession"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </>
  );
};

export default ProfessionInput;
