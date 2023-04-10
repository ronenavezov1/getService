import { signOut } from "next-auth/react";
import { FC, useState } from "react";

interface NavbarProps {
  name: string;
}

const Navbar: FC<NavbarProps> = ({ name }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 bg-indigo-600 p-2  shadow-md">
      <div className="flex  justify-between">
        <div>
          <LeftNavBar name={name} />
        </div>
        <div className="flex">
          <RightNavBar />
          <button className="w-8 sm:hidden" onClick={() => setIsOpen(!isOpen)}>
            <BurgerMenuIcon />
          </button>
        </div>
      </div>

      {isOpen && <BurgerMenu />}
    </div>
  );
};

interface LeftNavBarProps {
  name: string;
}

const LeftNavBar: FC<LeftNavBarProps> = ({ name }) => {
  return (
    <div className=" flex gap-4">
      <a className="cursor-pointer text-3xl  font-bold text-yellow-400 transition-colors  hover:text-yellow-500">
        Get Service
      </a>
      <h1 className=" self-end text-sm text-white"> {name}</h1>
    </div>
  );
};

const RightNavBar: FC = () => {
  return (
    <div className="gap- hidden place-items-center gap-8 sm:flex">
      <Links />
      <LogoutBtn />
    </div>
  );
};

const Links: FC = () => {
  return (
    <>
      <a className="text-white transition-colors  hover:text-yellow-400">
        Link 1
      </a>

      <a className="text-white transition-colors  hover:text-yellow-400">
        Link 2
      </a>

      <a className="text-white transition-colors  hover:text-yellow-400">
        Link 3
      </a>
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

const BurgerMenu: FC = () => {
  return (
    <div className="  flex flex-col gap-4  text-center sm:hidden">
      <Links />

      <LogoutBtn />
    </div>
  );
};

const LogoutBtn: FC = () => {
  return (
    <button
      onClick={() => signOut}
      className="rounded-lg bg-yellow-400  p-1 font-bold text-slate-700 hover:bg-yellow-500"
    >
      Logout
    </button>
  );
};

export default Navbar;
