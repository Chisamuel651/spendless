'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getLastBudgets, getLastTransactions, getReachedBudgets, getTotalTransactionAmount, getTotalTransactionCount, getUserBudgetData } from '../action';
import Wrapper from '../components/Wrapper';
import { BadgeDollarSign, Landmark, PiggyBank } from 'lucide-react';
import { BarChart, CartesianGrid, Bar, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Budget, Transaction } from '@/type';
import Link from 'next/link';
import BudgetItem from '../components/budgetItems';
import TransactionItem from '../components/TransactionItem';

const page = () => {
    const { user } = useUser();
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCounts, setTotalCounts] = useState<number | null>(null);
    const [reachedBudgetsRatio, setReachedBudgetsRatio] = useState<string | null>(null);
    const [budgetsData, setBudgetsData] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [budgets, setBudgets] = useState<Budget[]>([])

    const fetchData = async () => {
        setIsLoading(true)

        try {
            const email = user?.primaryEmailAddress?.emailAddress as string;
            if (email) {
                const amount = await getTotalTransactionAmount(email);
                const count = await getTotalTransactionCount(email);
                const reachedBudgets = await getReachedBudgets(email);
                const budgetsData = await getUserBudgetData(email);
                const lastTransactions = await getLastTransactions(email);
                const lastBudgets = await getLastBudgets(email)

                setTotalAmount(amount);
                setTotalCounts(count);
                setReachedBudgetsRatio(reachedBudgets);
                setBudgetsData(budgetsData);
                setTransactions(lastTransactions);
                setBudgets(lastBudgets);

                setIsLoading(false)
            }
        } catch (error) {
            console.log("An error occured when obtaining the data: ", error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [user])

    return (
        <Wrapper>
            {isLoading ? (
                <div className='flex justify-center items-center'>
                    <span className="loading loading-spinner text-info"></span>
                </div>
            ) : (
                <div>
                    <div className='grid md:grid-cols-3 gap-4'>
                        <div className='border-2 border-base-300 p-5 flex justify-between items-center rounded-xl'>
                            <div className='flex flex-col'>
                                <span className='text-gray-500 text-sm'>Total Transactions</span>
                                <span className='text-2xl font-bold text-accent'>
                                    {totalAmount !== null ? `${totalAmount} XAF` : 'N/A'}
                                </span>
                            </div>

                            <BadgeDollarSign className='bg-accent w-9 h-9 rounded-full p-1 text-white' />
                        </div>

                        <div className='border-2 border-base-300 p-5 flex justify-between items-center rounded-xl'>
                            <div className='flex flex-col'>
                                <span className='text-gray-500 text-sm'>Number Of Transactions</span>
                                <span className='text-2xl font-bold text-accent'>
                                    {totalAmount !== null ? `${totalCounts} Transactions` : 'N/A'}
                                </span>
                            </div>

                            <PiggyBank className='bg-accent w-9 h-9 rounded-full p-1 text-white' />
                        </div>

                        <div className='border-2 border-base-300 p-5 flex justify-between items-center rounded-xl'>
                            <div className='flex flex-col'>
                                <span className='text-gray-500 text-sm'>Attained Budgets</span>
                                <span className='text-2xl font-bold text-accent'>
                                    {reachedBudgetsRatio || 'N/A'}
                                </span>
                            </div>

                            <Landmark className='bg-accent w-9 h-9 rounded-full p-1 text-white' />
                        </div>
                    </div>

                    <div className='w-full md:flex mt-4'>
                        <div className='rounded-xl md:w-2/3' style={{ width: "100%" }}>
                            <div className='border-2 border-base-300 p-5 rounded-xl'>
                                <h3 className='text-lg font-semibold mb-3'>Statistics (in XAF)</h3>
                                <ResponsiveContainer height={250} width="100%">
                                    <BarChart width={730} height={250} data={budgetsData}>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                        <XAxis dataKey="budgetName" />
                                        <Tooltip />
                                        <Bar name="Budget" dataKey="totalBudgetAmount" fill="#00d7c0" radius={[10, 10, 0, 0]} />
                                        <Bar name="Expenses" dataKey="totalTransactionsAmount" fill="#023e8a" radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className='mt-4 border-2 border-base-300 p-5 rounded-xl'>
                                <h3 className='text-lg font-semibold mb-3'>Last Transactions</h3>

                                <ul className='divide-y divide-base-300'>
                                    {transactions.map((transaction: Transaction) => (
                                        <TransactionItem key={transaction.id} transaction={transaction}></TransactionItem>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className='md:w-1/3 ml-4'>
                            <h3 className='text-lg font-semibold my-4 md:mb-4 md:mt-0'>Last Budgets</h3>

                            <ul className='grid grid-cols-1 gap-4'>
                                {budgets.map((budget) => (
                                    <Link key={budget.id} href={`/manage/${budget.id}`}>
                                        <BudgetItem budget={budget} enableHover={1} />
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>


            )}
        </Wrapper>
    )
}

export default page
