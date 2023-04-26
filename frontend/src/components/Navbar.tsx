import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { FC, Fragment, useState } from "react";
import { UserRole } from "./Auth";
import Link from "next/link";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";

interface NavbarProps {
  firstName: string;
  lastName: string;
  role: UserRole;
}

const Navbar: FC<NavbarProps> = ({ firstName, lastName, role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onBurgerMenuClickHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" flex flex-col gap-4 bg-indigo-600 p-2 shadow-md">
      <div className="flex justify-between">
        <LeftNavBar firstName={firstName} lastName={lastName} />
        <RightNavBar role={role} onClickHandler={onBurgerMenuClickHandler} />
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
      <div className="text-3xl font-bold text-yellow-400 transition-colors  ">
        Get Service
      </div>
      <h1 className="text-sm text-white "> {`${firstName} ${lastName}`}</h1>
    </div>
  );
};

interface RightNavBarProps extends RoleProps {
  onClickHandler: React.MouseEventHandler<HTMLButtonElement>;
}

const RightNavBar: FC<RightNavBarProps> = ({ role, onClickHandler }) => {
  return (
    <div className="flex ">
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
      <CallsMenu />

      {/* worker/admin links  */}
      {(role === UserRole.ADMIN || role === UserRole.WORKER) && (
        <Link className="navLink" href={"/work/pick"}>
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

const CallsMenu: FC = () => {
  return (
    <Menu as="div" className=" relative inline-block text-center text-white ">
      <div className="">
        <Menu.Button className="inline-flex h-full w-full justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl ">
          {({ open }) => (
            <span
              className={`${
                open ? "bg-indigo-800 text-yellow-500" : "text-white"
              } w-full rounded-t-md p-2`}
            >
              Calls
            </span>
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="mm grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
          <div>
            <Menu.Item>
              {({ active }) => (
                <Link href={"/call"}>
                  <button
                    className={`${
                      active ? "bg-indigo-800 text-yellow-500" : "text-white"
                    } w-full  p-2`}
                  >
                    status
                  </button>
                </Link>
              )}
            </Menu.Item>
          </div>

          <div>
            <Menu.Item>
              {({ active }) => (
                <Link href={"/call/create"}>
                  <button
                    className={`${
                      active ? "bg-indigo-800 text-yellow-500" : "text-white"
                    }  w-full  p-2`}
                  >
                    create
                  </button>
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
