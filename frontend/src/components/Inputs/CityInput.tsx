import { Controller, useFormContext } from "react-hook-form";
import { type FC, Fragment, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import { useGetCities } from "~/api/cities";

export const CityInput: FC = () => {
  const { data: session } = useSession();
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext();
  const [query, setQuery] = useState("");
  const { data: cities } = useGetCities(session?.idToken ?? "", {
    startWith: query,
  });

  return (
    <>
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange } }) => (
          <Combobox
            onChange={onChange}
            defaultValue={getValues("city") as string}
          >
            <Combobox.Label className={"label"}>City</Combobox.Label>
            <div className="relative mt-1 w-full cursor-default ">
              <Combobox.Input
                placeholder="Select city"
                className="input"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />

              <Combobox.Button className="absolute right-0 h-full pr-2 ">
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
                <Combobox.Options className="comboboxOptions">
                  {/* custom city option */}
                  {/* {query.length > 0 && (
                    <Combobox.Option
                      className={({ active }) =>
                        `  cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        }`
                      }
                      value={query}
                    >
                      {query}
                    </Combobox.Option>
                  )} */}
                  {cities?.length === 0 && query.length >= 3 ? (
                    <div className=" cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    cities?.map((city: City) => (
                      <Combobox.Option
                        className={({ active }) =>
                          `  cursor-default select-none py-2 pl-10 pr-4 ${
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
    </>
  );
};

export default CityInput;
