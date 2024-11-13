'use client'
import { getTransactionsByBudgetId } from '@/app/action'
import BudgetItem from '@/app/components/budgetItems'
import { Budget } from '@/type'
import React, { useEffect, useState } from 'react'

const page = ({params} : {params: Promise<{budgetId: string}>}) => {

    const [budgetId, setBudgetId] = useState<string>("")
    const [budget, setBudget] = useState<Budget>()

    async function fetchBudgetData (budgetId: string){
        try {
            if(budgetId){
                const budgetData = await getTransactionsByBudgetId(budgetId)
                setBudget(budgetData)
            }
        } catch (error) {
            console.error("An error occured: ", error);
            throw error;
        }
    }

    useEffect(() => {
        const getId = async () => {
            const resolvedParams = await params;
            setBudgetId(resolvedParams.budgetId);
            fetchBudgetData(resolvedParams.budgetId)
        }
        getId()
    }, [params])

  return (
    <div>
      {budget && (
        <BudgetItem budget={budget} enableHover={0} />
      )}
    </div>
  )
}

export default page
