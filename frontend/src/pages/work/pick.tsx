import { type FC } from "react";
import { z } from "zod";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { CityInput } from "~/components/Inputs/CityInput";

const Pick: NextPageWithAuth = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <PickQueryForm />
      <div>pick</div>
    </div>
  );
};

Pick.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.WORKER],
};

const PickQuerySchema = z.object({
  profession: z.string(),
  city: z.string(),
  dateLimit: z.number(),
});

type PickQuerySchemaType = z.infer<typeof PickQuerySchema>;

const PickQueryForm: FC = () => {
  return (
    <>
      <ProfessionInput />
      <CityInput />
      <DateLimitInput />
    </>
  );
};

export default Pick;
