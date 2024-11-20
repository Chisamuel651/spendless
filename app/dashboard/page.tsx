'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { getReachedBudgets, getTotalTransactionAmount, getTotalTransactionCount } from '../action';
import Wrapper from '../components/Wrapper';
import { BadgeDollarSign, Landmark, PiggyBank } from 'lucide-react';

const page = () => {
    const { user } = useUser();
    const [ totalAmount, setTotalAmount ] = useState<number | null>(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ totalCounts, setTotalCounts ] = useState<number | null>(null);
    const [ reachedBudgetsRatio, setReachedBudgetsRatio ] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true)

        try {
            const email = user?.primaryEmailAddress?.emailAddress as string;
            if(email){
                const amount = await getTotalTransactionAmount(email);
                const count = await getTotalTransactionCount(email);
                const reachedBudgets = await getReachedBudgets(email);
                setTotalAmount(amount);
                setTotalCounts(count);
                setReachedBudgetsRatio(reachedBudgets);
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
        ): (
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
                
            </div>

            
        )}
    </Wrapper>
  )
}

export default page
