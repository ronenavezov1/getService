import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { type FC, Fragment, type MouseEventHandler } from "react";
import { UserRole } from "./Auth";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";

interface NavbarProps {
  firstName: string;
  lastName: string;
  role: UserRole;
}

const Navbar: FC<NavbarProps> = ({ firstName, lastName, role }) => {
  return (
    <div className="flex flex-col gap-4 bg-indigo-600 px-2 pt-1 shadow-md">
      <div className="flex justify-between">
        <LeftNavBar />
        <RightNavBar role={role} firstName={firstName} lastName={lastName} />
      </div>
    </div>
  );
};

interface RoleProps {
  role: UserRole;
}

interface RightNavBarProps extends RoleProps {
  firstName: string;
  lastName: string;
}

const LeftNavBar: FC = () => {
  return (
    <div className=" text-3xl font-bold text-yellow-400 transition-colors  ">
      Get Service
    </div>
  );
};

const RightNavBar: FC<RightNavBarProps> = ({ role, firstName, lastName }) => {
  return (
    <>
      {/* Desktop menu */}
      {/* <Popover as="div" className="hidden grow  justify-end md:flex">
        <Popover.Panel className="flex w-full max-w-md gap-4 " static>
          <Links role={role} />
        </Popover.Panel>
      </Popover> */}

      {/* mobile menu add md:hidden*/}
      <Popover as="div" className="self-end text-white ">
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
              <Popover.Panel className="absolute left-0 z-10 w-full rounded-b-md bg-indigo-600 shadow-md focus:outline-none  ">
                <UserInfo
                  role={role}
                  firstName={firstName}
                  lastName={lastName}
                />

                <Links role={role} closeBurger={close} />
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

const UserInfo = ({ firstName, lastName, role }: RightNavBarProps) => {
  const customerMsg =
    "Create service calls and we will find you a worker that fits your needs";
  const workerMsg = "Pick service calls that fits your preferences!";
  const adminMsg = "";

  return (
    <div className="px-2 pb-2">
      <h1 className="align-top font-bold">{`Welcome ${firstName} ${lastName},`}</h1>
      {
        <p className="pt-1 text-sm leading-none">
          {role === UserRole.CUSTOMER
            ? customerMsg
            : role === UserRole.WORKER
            ? workerMsg
            : role === UserRole.ADMIN
            ? adminMsg
            : null}
        </p>
      }
    </div>
  );
};

interface LinksProps extends RoleProps {
  closeBurger?: MouseEventHandler<HTMLAnchorElement>;
}

const Links = ({ role, closeBurger }: LinksProps) => {
  return (
    <div className="text-center">
      {role === UserRole.CUSTOMER && (
        <CustomerLinks closeBurger={closeBurger} />
      )}
      {role === UserRole.WORKER && <WorkerLinks closeBurger={closeBurger} />}
      {role === UserRole.ADMIN && <AdminLinks closeBurger={closeBurger} />}
      <LogoutBtn />
    </div>
  );
};

const AdminLinks = ({ closeBurger }: PopItemProps) => {
  return (
    <>
      {/* status - /call */}
      <Link href={"/call"} onClick={closeBurger} className={`navBarLink `}>
        Status Calls
      </Link>
      {/* users /backoffice/users */}
      <Link
        href={"/backoffice/users"}
        onClick={closeBurger}
        className={`navBarLink `}
      >
        User Management
      </Link>
    </>
  );
};

const WorkerLinks = ({ closeBurger }: PopItemProps) => {
  return (
    <>
      {/* status - /call */}
      <Link href={"/call"} onClick={closeBurger} className={`navBarLink `}>
        Status Calls
      </Link>
      {/* pick call /work/pick */}
      <Link href={"/work/pick"} onClick={closeBurger} className={`navBarLink`}>
        Pick Call
      </Link>
    </>
  );
};

const CustomerLinks = ({ closeBurger }: PopItemProps) => {
  return (
    <>
      {/* status - /call */}
      <Link href={"/call"} onClick={closeBurger} className={`navBarLink`}>
        Status Calls
      </Link>

      {/* create /call/create */}
      <Link
        href={"/call/create"}
        onClick={closeBurger}
        className={`navBarLink`}
      >
        Create Call
      </Link>
    </>
  );
};

// return (
//   <>
//     {/* user links  */}

//     {(role === UserRole.ADMIN || role === UserRole.CUSTOMER) && (
//       <CallsMenu closeBurger={closePop} />
//     )}

//     {/* worker/admin links  */}
//     {(role === UserRole.ADMIN || role === UserRole.WORKER) && (
//       <WorkMenu closeBurger={closePop} />
//     )}

//     {/* admin links  */}
//     {/* <AdminMenu closeBurger={closePop} /> */}

//     {/* logout Button */}
//     <LogoutBtn />
//   </>
// );

// const AdminMenu = ({ closeBurger }: PopMenuProps) => {
//   return (
//     <Menu
//       as="div"
//       className="relative inline-block w-full text-center text-white "
//     >
//       <div className="">
//         <Menu.Button className="inline-flex h-full w-full justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl ">
//           {({ open }) => (
//             <span
//               className={`${
//                 open ? "bg-indigo-800 text-yellow-500" : "text-white"
//               } w-full rounded-t-md p-2`}
//             >
//               Admin
//             </span>
//           )}
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="z-20 grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
//           <div>
//             <Menu.Item>
//               {({ active }) => (
//                 <Link
//                   href={"/backoffice/users"}
//                   onClick={closeBurger}
//                   className={`${
//                     active ? "bg-indigo-800 text-yellow-500" : "text-white"
//                   } block w-full  p-2`}
//                 >
//                   users
//                 </Link>
//               )}
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// };

const LogoutBtn: FC = () => {
  const queryClient = useQueryClient();

  const onClickHandler = async () => {
    await signOut();
    await queryClient.invalidateQueries({ queryKey: ["users"] });
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

interface PopItemProps {
  closeBurger?: MouseEventHandler<HTMLAnchorElement>;
}

// const WorkMenu: FC<PopMenuProps> = ({ closeBurger }) => {
//   return (
//     <Menu
//       as="div"
//       className="relative inline-block w-full text-center text-white "
//     >
//       <div className="">
//         <Menu.Button className="inline-flex h-full w-full justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl ">
//           {({ open }) => (
//             <span
//               className={`${
//                 open ? "bg-indigo-800 text-yellow-500" : "text-white"
//               } w-full rounded-t-md p-2`}
//             >
//               Work
//             </span>
//           )}
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="z-20 grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
//           <div>
//             <StatusMenuItem closeBurger={closeBurger} />
//           </div>

//           <div>
//             <Menu.Item>
//               {({ active }) => (
//                 <Link
//                   href={"/work/pick"}
//                   onClick={closeBurger}
//                   className={`${
//                     active ? "bg-indigo-800 text-yellow-500" : "text-white"
//                   } block w-full  p-2`}
//                 >
//                   pick
//                 </Link>
//               )}
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// };

// const CallsMenu = ({ closeBurger: closePop }: PopItemProps) => {
//   return (
//     <Menu
//       as="div"
//       className="relative inline-block w-full text-center text-white "
//     >
//       <Menu.Button className="inline-flex h-full w-full justify-center focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 md:max-w-xl ">
//         {({ open }) => (
//           <span
//             className={`${
//               open ? "bg-indigo-800 text-yellow-500" : "text-white"
//             } w-full rounded-t-md p-2`}
//           >
//             Calls
//           </span>
//         )}
//       </Menu.Button>

//       <Menu.Items className=" z-20 grid w-full overflow-hidden rounded-b-md bg-indigo-700 focus:outline-none md:absolute ">
//         <div>
//           <StatusMenuItem closeBurger={closePop} />
//         </div>

//         <div>
//           <Menu.Item>
//             {({ active }) => (
//               <Link
//                 href={"/call/create"}
//                 onClick={closePop}
//                 className={`${
//                   active ? "bg-indigo-800 text-yellow-500" : "text-white"
//                 }  block w-full p-2`}
//               >
//                 create
//               </Link>
//             )}
//           </Menu.Item>
//         </div>
//       </Menu.Items>
//     </Menu>
//   );
// };

// const StatusMenuItem = ({ closeBurger }: PopItemProps) => {
//   return (
//     <Menu.Item>
//       {({ active }) => (
//         <Link
//           href={"/call"}
//           onClick={closeBurger}
//           className={`${
//             active ? "bg-indigo-800 text-yellow-500" : "text-white"
//           } block w-full  p-2`}
//         >
//           status
//         </Link>
//       )}
//     </Menu.Item>
//   );
// };
