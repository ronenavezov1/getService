import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { type FC, Fragment, type MouseEventHandler } from "react";
import { UserRole } from "./Auth";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Menu, Popover, Transition } from "@headlessui/react";

interface NavbarProps {
  firstName: string;
  lastName: string;
  role: UserRole;
}

const Navbar: FC<NavbarProps> = ({ firstName, lastName, role }) => {
  return (
    <div className="   flex flex-col gap-4 bg-indigo-600 px-2 pt-1 shadow-md">
      <div className="  flex justify-between">
        <LeftNavBar firstName={firstName} lastName={lastName} />
        <RightNavBar role={role} />
      </div>
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
    <div className=" flex items-end  gap-4">
      <div className=" text-3xl font-bold text-yellow-400 transition-colors  ">
        Get Service
      </div>
      <h1 className="text-sm  text-white "> {`${firstName} ${lastName}`}</h1>
    </div>
  );
};

const RightNavBar: FC<RoleProps> = ({ role }) => {
  return (
    <>
      {/* Desktop menu */}
      <Popover as="div" className="hidden grow  justify-end md:flex">
        <Popover.Panel className="flex w-full max-w-md gap-4 " static>
          <Links role={role} />
        </Popover.Panel>
      </Popover>

      {/* mobile menu */}
      <Popover as="div" className="self-end  text-white md:hidden ">
        {({ close }) => (
          <>
            <Popover.Button className={`  focus:outline-none  md:max-w-xl `}>
              {({ open }) => (
                <Bars3Icon
                  className={`${
                    open ? "rotate-90 transform " : " transform"
                  } h-8 w-8 fill-yellow-400 `}
                />
              )}
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Popover.Panel className="absolute left-0 z-10 w-full  rounded-b-md bg-indigo-600 focus:outline-none  ">
                <Links role={role} closeBurger={close} />
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

interface LinksProps extends RoleProps {
  closeBurger?: MouseEventHandler<HTMLAnchorElement>;
}

const Links = ({ role, closeBurger: closePop }: LinksProps) => {
  return (
    <>
      {/* user links  */}

      <CallsMenu closeBurger={closePop} />

      {/* worker/admin links  */}
      {(role === UserRole.ADMIN || role === UserRole.WORKER) && (
        <WorkMenu closeBurger={closePop} />
      )}

      {/* admin links  */}

      {/* logout Button */}
      <LogoutBtn />
    </>
  );
};

const LogoutBtn: FC = () => {
  const queryClient = useQueryClient();

  const onClickHandler = async () => {
    await signOut();
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    <button
      onClick={onClickHandler}
      className="w-full rounded-lg bg-yellow-400  p-1 font-bold text-slate-700 hover:bg-yellow-500"
    >
      Logout
    </button>
  );
};

export default Navbar;

interface PopMenuProps {
  closeBurger?: MouseEventHandler<HTMLAnchorElement>;
}

const WorkMenu: FC<PopMenuProps> = ({ closeBurger }) => {
  return (
    <Menu
      as="div"
      className="relative inline-block w-full text-center text-white "
    >
      <div className="">
        <Menu.Button className="inline-flex h-full w-full justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl ">
          {({ open }) => (
            <span
              className={`${
                open ? "bg-indigo-800 text-yellow-500" : "text-white"
              } w-full rounded-t-md p-2`}
            >
              Work
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
        <Menu.Items className="z-20 grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
          <div>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href={"/work/pick"}
                  onClick={closeBurger}
                  className={`${
                    active ? "bg-indigo-800 text-yellow-500" : "text-white"
                  } block w-full  p-2`}
                >
                  pick
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const CallsMenu = ({ closeBurger: closePop }: PopMenuProps) => {
  return (
    <Menu
      as="div"
      className="relative inline-block w-full text-center text-white "
    >
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

      <Menu.Items className=" z-20 grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
        <div>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={"/call"}
                onClick={closePop}
                className={`${
                  active ? "bg-indigo-800 text-yellow-500" : "text-white"
                } block w-full  p-2`}
              >
                status
              </Link>
            )}
          </Menu.Item>
        </div>

        <div>
          <Menu.Item>
            {({ active }) => (
              <Link
                href={"/call/create"}
                onClick={closePop}
                className={`${
                  active ? "bg-indigo-800 text-yellow-500" : "text-white"
                }  block w-full p-2`}
              >
                create
              </Link>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};
