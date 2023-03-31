import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

const completeDetails = () => {
  const router = useRouter();
  const { data: session } = useSession(); //replace with user query
  const formHook = useForm({
    defaultValues: {
      //TODO: update with user data
      name: "",
      phone: "123",
    },
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formHook;

  type userInputs = {
    name: string;
    phone: string;
  };

  //TODO: fix this
  const onSubmit = async (data: userInputs) => {
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
        className=" m-auto grid h-screen max-w-md content-center gap-4 p-4  "
      >
        <Header />
        <NameInput />
        <PhoneInput />
        <IdInput />
        <AddressInput />

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

const NameInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label
        htmlFor="name"
        className="mb-2 block text-sm font-bold text-gray-700"
      >
        Name
      </label>
      <input
        id="name"
        {...register("name", { required: "Name is required " })}
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
      />
      <ErrorMessage
        errors={errors}
        name="name"
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
        {...register("phone", { required: "Phone is required " })}
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
        {...register("id", { required: "ID is required " })}
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
        {...register("address", { required: "ID is required " })}
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

export default completeDetails;
