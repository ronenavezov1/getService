import { ErrorMessage } from "@hookform/error-message";
import { type FC } from "react";
import { useFormContext } from "react-hook-form";

export const ProfessionInput: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label htmlFor="profession" className="label">
        Profession
      </label>
      <input
        id="profession"
        {...register("profession", { shouldUnregister: true })}
        className="input"
      />
      <ErrorMessage
        errors={errors}
        name="profession"
        render={({ message }) => (
          <p className=" pt-1 text-xs text-red-600">{message}</p>
        )}
      />
    </div>
  );
};

export default ProfessionInput;
