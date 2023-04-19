import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { FC, useState } from "react";
import { UserRole } from "./Auth";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";

interface NavbarProps {
  firstName: string;
  lastName: string;
  role: UserRole;
}

const Navbar: FC<NavbarProps> = ({ firstName, lastName, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onBurgerClickHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-4 bg-indigo-600 p-2 shadow-md">
      <div className="flex justify-between">
        <LeftNavBar firstName={firstName} lastName={lastName} />
        <RightNavBar role={role} onClickHandler={onBurgerClickHandler} />
      </div>
      {isOpen && <BurgerMenu role={role} />}
    </div>
  );
};

interface LeftNavBarProps {
  firstName: string;
  lastName: string;
}

interface RoleProps {
  role: UserRole;
}

const LeftNavBar: FC<LeftNavBarProps> = ({ firstName, lastName }) => {
  return (
    <div className=" flex items-center gap-4">
      <Link
        className="cursor-pointer text-3xl font-bold text-yellow-400 transition-colors  hover:text-yellow-500"
        href="/"
      >
        Get Service
      </Link>
      <h1 className="text-sm text-white "> {`${firstName} ${lastName}`}</h1>
    </div>
  );
};

interface RightNavBarProps extends RoleProps {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const RightNavBar: FC<RightNavBarProps> = ({ role, onClickHandler }) => {
  return (
    <div className="flex">
      <div className="hidden place-items-center gap-8 md:flex">
        <Links role={role} />
      </div>
      <button className="w-8 md:hidden" onClick={onClickHandler}>
        <Bars3Icon className=" fill-yellow-400" />
      </button>
    </div>
  );
};

const Links: FC<RoleProps> = ({ role }) => {
  return (
    <>
      {/* user links  */}

      <Link className="navLink" href={"/call/status"}>
        Status
      </Link>

      <Link className="navLink" href={"/call/create"}>
        Create call
      </Link>

      {/* worker/admin links  */}
      {(role === UserRole.ADMIN || role === UserRole.WORKER) && (
        <Link className="navLink" href={"/worker/pick"}>
          Pick
        </Link>
      )}

      {/* admin links  */}
      {role === UserRole.ADMIN && (
        <Link className="navLink" href={"/backoffice/users"}>
          Users
        </Link>
      )}

      <LogoutBtn />
    </>
  );
};

const BurgerMenu: FC<RoleProps> = ({ role }) => {
  return (
    <div className="  flex flex-col gap-4 text-center md:hidden">
      <Links role={role} />
    </div>
  );
};

const LogoutBtn: FC = () => {
  const queryClient = useQueryClient();

  const onClickHandler = async () => {
    await signOut();
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <button
      onClick={onClickHandler}
      className="rounded-lg bg-yellow-400  p-1 font-bold text-slate-700 hover:bg-yellow-500"
    >
      Logout
    </button>
  );
};

export default Navbar;
