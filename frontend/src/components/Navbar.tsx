import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { UserRole } from "./Auth";

interface NavbarProps {
  name: string;
  role: UserRole;
}

const Navbar: FC<NavbarProps> = ({ name, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(role);

  return (
    <div className="flex flex-col gap-4 bg-indigo-600 p-2  shadow-md">
      <div className="flex justify-between">
        <div>
          <LeftNavBar name={name} />
        </div>
        <div className="flex">
          <RightNavBar role={role} />
          <button className="w-8 sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            <BurgerMenuIcon />
          </button>
        </div>
      </div>

      {isOpen && <BurgerMenu role={role} />}
    </div>
  );
};

interface LeftNavBarProps {
  name: string;
}

interface RoleProps {
  role: UserRole;
}

const LeftNavBar: FC<LeftNavBarProps> = ({ name }) => {
  const rounter = useRouter();
  const onClickHandler = async () => {
    await rounter.push("/");
  };
  return (
    <div className=" flex gap-4">
      <a
        className="cursor-pointer text-3xl  font-bold text-yellow-400 transition-colors  hover:text-yellow-500"
        onClick={onClickHandler}
      >
        Get Service
      </a>
      <h1 className=" self-end text-sm text-white"> {name}</h1>
    </div>
  );
};

const RightNavBar: FC<RoleProps> = ({ role }) => {
  return (
    <div className="gap- hidden place-items-center gap-8 sm:flex">
      <Links role={role} />
    </div>
  );
};

const Links: FC<RoleProps> = ({ role }) => {
  const router = useRouter();
  const onStatusClickHandler = async () => {
    await router.push("/call/status");
  };
  const onCreateCallClickHandler = async () => {
    await router.push("/call/create");
  };

  const onPickClickHandler = async () => {
    await router.push("/provider/pick");
  };

  const onUsersClickHandler = async () => {
    await router.push("/backoffice/users");
  };

  return (
    <>
      {/* user links  */}

      <a className="navLink" onClick={onStatusClickHandler}>
        Status
      </a>

      <a className="navLink" onClick={onCreateCallClickHandler}>
        Create call
      </a>

      {/* provider/admin links  */}
      {(role === UserRole.ADMIN || role === UserRole.PROVIDER) && (
        <a className="navLink" onClick={onPickClickHandler}>
          Pick
        </a>
      )}

      {/* admin links  */}
      {role === UserRole.ADMIN && (
        <a className="navLink" onClick={onUsersClickHandler}>
          Users
        </a>
      )}

      <LogoutBtn />
    </>
  );
};

const BurgerMenuIcon: FC = () => {
  return (
    <svg
      viewBox="0 0 24.00 24.00"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#CCCCCC"
        strokeWidth="0.096"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M4 17H20M4 12H20M4 7H20"
          stroke="#ca8a04"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};

const BurgerMenu: FC<RoleProps> = ({ role }) => {
  return (
    <div className="  flex flex-col gap-4  text-center sm:hidden">
      <Links role={role} />
    </div>
  );
};

const LogoutBtn: FC = () => {
  const queryClient = useQueryClient();

  const onClickHandler = async () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
    await signOut();
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
