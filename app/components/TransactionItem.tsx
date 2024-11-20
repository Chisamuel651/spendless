import { Transaction } from '@/type'
import Link from 'next/link'
import React from 'react'


interface TransactionItemProps {
    transaction: Transaction
}

const TransactionItem: React.FC<TransactionItemProps> = ({transaction}) => {
  return (
    <li className='flex flex-wrap justify-between items-center gap-4' key={transaction.id}>
        <div className='w-full sm:w-auto my-4'>
            <button className='btn'>
                <div className="badge badge-accent">
                    - {transaction.amount}
                </div>
                {transaction.budgetName}
            </button>
        </div>

        <div className="w-full md:w-auto md:hidden flex flex-col items-end">
            <span className='font-bold text-sm text-right break-words'>{transaction.description}</span>
            <span className='text-sm text-right'>
                {transaction.createdAt.toLocaleDateString("fr-FR")} at {" "} {transaction.createdAt.toLocaleTimeString("fr-FR", {
                    hour: '2-digit',
                    minute: '2-digit',
                })} 
            </span>
        </div>

        <div className="hidden md:flex">
            <span className='font-bold text-sm'>{transaction.description}</span>
        </div>
        <div className="hidden md:flex">
            {transaction.createdAt.toLocaleDateString("fr-FR")} at {" "} {transaction.createdAt.toLocaleTimeString("fr-FR", {
                hour: '2-digit',
                minute: '2-digit',
            })} 
        </div>

        <div className="hidden md:flex">
            <Link href={`/manage/${transaction.budgetId}`} className='btn'>see more</Link>
        </div>
    </li>
  )
}

export default TransactionItem
