import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next/types";
import { type NextPageWithAuth, UserRole } from "~/components/Auth";
import { EditCallForm } from "~/components/CallForm";

interface CallIndexProps {
  id: string;
}

const Edit: NextPageWithAuth<CallIndexProps> = ({ id }) => {
  return (
    <div className=" bodyDiv ">
      <EditCallForm callId={id} />
    </div>
  );
};

export const getServerSideProps = ({
  query,
}: GetServerSidePropsContext): GetServerSidePropsResult<{ id: string }> => {
  const { id } = query;

  return {
    props: { id: id as string },
  };
};

Edit.auth = {
  requiredRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.WORKER],
};

export default Edit;
