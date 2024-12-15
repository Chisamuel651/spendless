import Link from "next/link";
import Navbar from "./components/Navbar";
import BudgetItem from "./components/budgetItems";
import budgets from "./data";

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
          </div>

          <ul className='grid md:grid-cols-3 gap-4 mt-6 md:min-w-[1200px]'>
            { budgets.map((budget) => (
              <Link key={budget.id} href={""}>
                <BudgetItem budget={budget} enableHover={1}>
                  
                </BudgetItem>
              </Link>
            ))

            }
          </ul>
        </div>
      </div>
    </div>
  );
}
