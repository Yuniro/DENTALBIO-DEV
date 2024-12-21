"use client";

import { Manrope } from "next/font/google";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const manrope = Manrope({ subsets: ["latin"] });

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  return (
    <div
      className={`${manrope.className} flex flex-col items-center justify-center min-h-screen gap-10 text-center mx-auto px-10`}
    >
      <span className="bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
        <span className="text-2xl -mb-5 lg:text-3xl font-bold  max-w-screen-md w-full mx-auto bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
          You did it!
        </span>
        <span className="flex items-center mb-4  justify-center flex-col text-6xl md:text-8xl font-bold">
          dental.bio/<span className=" font-bold">{username}</span>
        </span>
        <span className="text-3xl font-bold  max-w-screen-md w-full mx-auto from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent">
          is <span className=" border-b-4 border-[#8866e9] ">almost</span>{" "}
          yours!
        </span>
      </span>

      <span className="text-2xl -mb-5 -mt-5 lg:text-3xl font-bold  max-w-screen-md w-full mx-auto bg-gradient-to-r from-[#8866e9] via-[#cb7470] to-[#ed8b39] bg-clip-text text-transparent">
        Please check your email to complete your registration!
      
      <svg
        strokeWidth={1.5}
        fill="url(#grad1)" // Applying the gradient for the fill
        stroke="url(#grad1)"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        className="mx-auto mt-5"
        height="100"
        viewBox="0 0 256 256"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8866e9" />
            <stop offset="50%" stopColor="#cb7470" />
            <stop offset="100%" stopColor="#ed8b39" />
          </linearGradient>
        </defs>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"
        />
      </svg>
      </span>

      <p className="text-md font-bold text-2xl md:text-3xl leading-normal md:leading-normal md:mt-[50px] max-w-screen-md w-full text-center text-[#8866e9]">
        Help us spread the word by letting your friends know to secure their
        free Dentalbio website too!
      </p>

      <Link href={"/"}>
        <Image
          src={"/logo.svg"}
          width={200}
          height={25}
          alt="Dental.bio navigation bar logo"
          className="px-4 py-3 pt-5"
        />
      </Link>
    </div>
  );
}
