import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { Fragment, type FC, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { type Profession, useGetProfessions } from "~/api/professions";

export const ProfessionInput: FC = () => {
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();
  const { data: professions } = useGetProfessions(session?.idToken ?? "");
  const [query, setQuery] = useState("");

  const filteredProfessions =
    query === ""
      ? professions
      : professions?.filter((profession) => {
          return profession.value.toLowerCase().includes(query.toLowerCase());
        });

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
            <div className="relative -mt-1 w-full cursor-default ">
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
                  {filteredProfessions?.length === 0 ? (
                    <div className=" cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredProfessions?.map((profession: Profession) => (
                      <Combobox.Option
                        className={({ active }) =>
                          ` relative  cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                        key={profession.value}
                        value={profession.value}
                      >
                        {({ selected, active }) => (
                          <div className="flex justify-center gap-1">
                            {profession.value}
                            {selected ? (
                              <span
                                className={`   ${
                                  active ? "text-white" : "text-indigo-500"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        )}
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
    watch,
  } = useFormContext();
  const { data: professions, isFetching } = useGetProfessions(
    session?.idToken ?? ""
  );
  const [query, setQuery] = useState("");

  const filteredProfessions =
    query === ""
      ? professions
      : professions?.filter((profession) => {
          return profession.value.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Controller
        control={control}
        name="profession"
        render={({ field: { onChange } }) => (
          <Combobox
            onChange={onChange}
            value={watch("profession") ?? []}
            multiple
          >
            <Combobox.Label className={"label"}>profession</Combobox.Label>
            <div className="relative z-10 -mt-1 w-full cursor-default ">
              <Combobox.Input
                placeholder="Select Profession"
                className="input"
                // displayValue={(value: string[]) => value.join(", ")}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />

              <Combobox.Button className="absolute right-0 top-2 pr-2 ">
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
                  {isFetching && (
                    <div className=" cursor-default select-none py-2 px-4 text-gray-700">
                      Loading professions...
                    </div>
                  )}
                  {filteredProfessions?.length === 0 ? (
                    <div className=" cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredProfessions?.map((profession: Profession) => (
                      <Combobox.Option
                        className={({ active }) =>
                          ` relative  cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-blue-500 text-white" : "text-gray-900"
                          }`
                        }
                        key={profession.value}
                        value={profession.value}
                      >
                        {({ selected, active }) => (
                          <div className="flex justify-center gap-1">
                            {profession.value}
                            {selected ? (
                              <span
                                className={`   ${
                                  active ? "text-white" : "text-indigo-500"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </div>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        )}
      />

      <SelectProfession />

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

const SelectProfession: FC = () => {
  const { getValues, setValue, watch } = useFormContext();

  return (
    <>
      {watch("profession")?.length > 0 && (
        <div className="flex flex-col gap-2 ">
          <span className="label">Selected professions:</span>
          {watch("profession").map((val: string) => (
            <div className="flex gap-2  px-4 marker:text-indigo-600" key={val}>
              <li>{val}</li>
              <button
                onClick={() => {
                  setValue(
                    "profession",
                    getValues("profession").filter((v: string) => v !== val)
                  );
                }}
              >
                <XMarkIcon
                  className="h-5 w-5 fill-red-500"
                  aria-hidden="true"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfessionInput;
