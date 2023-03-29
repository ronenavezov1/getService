import { ErrorMessage } from "@hookform/error-message";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

const profile = () => {
  const router = useRouter();
  const { data: session } = useSession(); //replace with user query
  const formHook = useForm({
    defaultValues: {
      name: session?.user.name ?? "",
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

export default profile;
