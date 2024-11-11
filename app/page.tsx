import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center flex-col py-10 w-full">
        <div>
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Take control <br /> of your budget
            </h1>

            <p className="py-6 text-gray-800 text-center">
              Keep an eye on your expenses and your budget <br /> simply, with our intuitive application!
            </p>

            <div className="flex justify-center items-center">
              <Link href={"/sign-in"} className="btn btn-sm md:btn-md btn-outline btn-accent">Login</Link>
              <Link href={"/sign-up"} className="btn btn-sm md:btn-md ml-2 btn-accent">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
