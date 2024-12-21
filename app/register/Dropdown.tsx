// "use client";
// import { useState } from "react";

// function ChevDown() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="size-6"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="m19.5 8.25-7.5 7.5-7.5-7.5"
//       />
//     </svg>
//   );
// }

// function ChevUp() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       fill="none"
//       viewBox="0 0 24 24"
//       strokeWidth={1.5}
//       stroke="currentColor"
//       className="size-6"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         d="m4.5 15.75 7.5-7.5 7.5 7.5"
//       />
//     </svg>
//   );
// }

// type DropdownProps = {
//   selected: string;
//   onSelect: (value: string) => void;
//   options: string[];
//   label: string;
// };

// export default function Dropdown({
//   selected,
//   onSelect,
//   options,
//   label,
// }: DropdownProps) {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleOptionClick = (option: string) => {
//     onSelect(option); // Pass selected option to parent
//     setIsOpen(false); // Close dropdown after selecting an option
//   };

//   return (
//     <div className="relative z-50 left-1/2 top-5 transform -translate-x-1/2 max-w-lg w-full px-5 mt-5">
//       <div
//         className={`max-w-lg w-full rounded-[30px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-3 px-3 flex flex-col items-center justify-between transition-all duration-300 ease-in-out ${
//           isOpen ? "h-auto" : "h-[60px]"
//         }`}
//       >
//         {/* Header (Selected Option and ChevDown/ChevUp) */}
//         <div
//           className="w-full flex justify-between items-center cursor-pointer"
//           onClick={toggleMenu}
//         >
//           <span className="text-base text-dark px-4 py-1.5">
//             {selected || `Select ${label}`}
//           </span>
//           <div className=" px-4">{isOpen ? <ChevUp /> : <ChevDown />}</div>
//         </div>

//         {/* Dropdown content */}
//         <div
//           className={`flex-col items-center justify-center gap-2 w-full overflow-hidden transition-all  duration-300 ease-in-out ${
//             isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//           }`}
//           style={{
//             transitionProperty: "max-height, opacity",
//             transitionDuration: isOpen ? "400ms" : "300ms",
//           }}
//         >
//           <div className="flex flex-col justify-start items-center gap-4 w-full mt-2 max-h-96 overflow-y-scroll">
//             {options.map((option) => (
//               <button
//                 key={option}
//                 onClick={() => handleOptionClick(option)}
//                 className="py-3 px-4 rounded-full text-dark w-full transition-all text-base hover:bg-primary-4 text-center duration-300 ease-in-out"
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";

function ChevDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="size-6 text-primary-orange-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function ChevUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="size-6 text-primary-orange-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 15.75 7.5-7.5 7.5 7.5"
      />
    </svg>
  );
}

type DropdownProps = {
  selected: string;
  onSelect: (value: string) => void;
  options: string[];
  label: string;
};

export default function Dropdown({
  selected,
  onSelect,
  options,
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    onSelect(option); // Pass selected option to parent
    setIsOpen(false); // Close dropdown after selecting an option
  };

  return (
    <div className="relative z-50 left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5 text-2xl">
      <div
        className={`max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex flex-col items-center justify-between transition-all duration-300 ease-in-out ${
          isOpen ? "h-auto" : "h-[77px]"
        }`}
      >
        {/* Header (Selected Option and ChevDown/ChevUp) */}
        <div
          className="w-full flex justify-between items-center cursor-pointer"
          onClick={toggleMenu}
        >
          <span className="text-2xl font-semibold text-dark px-4 py-1.5">
            {selected || `Select ${label}`}
          </span>
          <div className=" px-4">{isOpen ? <ChevUp /> : <ChevDown />}</div>
        </div>

        {/* Dropdown content */}
        <div
          className={`flex-col items-center justify-center gap-2 w-full overflow-hidden transition-all  duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            transitionProperty: "max-height, opacity",
            transitionDuration: isOpen ? "400ms" : "300ms",
          }}
        >
          <div className="flex flex-col justify-start items-center gap-4 w-full mt-2 max-h-96 overflow-y-scroll">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className="py-3 px-4 rounded-full text-dark w-full transition-all text-2xl font-semibold hover:bg-primary-4 text-center duration-300 ease-in-out"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
