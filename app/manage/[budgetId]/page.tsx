'use client'
import { addTransactionsToBudget, getTransactionsByBudgetId } from '@/app/action'
import BudgetItem from '@/app/components/budgetItems'
import Wrapper from '@/app/components/Wrapper'
import { Budget } from '@/type'
import React, { useEffect, useState } from 'react'
import Notification from '../../components/Notification';

const page = ({params} : {params: Promise<{budgetId: string}>}) => {

    const [budgetId, setBudgetId] = useState<string>("")
    const [budget, setBudget] = useState<Budget>()
    const [description, setDescription] = useState<string>('')
    const [amount, setAmount] = useState<string>('')

    const [notification, setNotification] = useState<string>("")
    const closeNotification = () => {
      // close notification
      setNotification("")
    }

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

    const handleAddTransaction = async () => {
      if(!amount || !description){
        setNotification('Please all the fields.')
        return;
      }

      try {
        const amountNumber = parseFloat(amount);
        if(isNaN(amountNumber) || amountNumber <= 0){
          throw new Error("The amount must be a positive")
        }

        const newTransaction = await addTransactionsToBudget(budgetId, amountNumber, description)

        setNotification('Transaction added successfully')
        fetchBudgetData(budgetId)

        setAmount('')
        setDescription('')
      } catch (error) {
        setNotification("You\'ve exceeded the budget amount.")
      }
    }

  return (
    <Wrapper>

      {notification && (
        <Notification message={notification} onclose={closeNotification}></Notification>
      )}

      {budget && (
        <div className='flex md:flex-row flex-col'>
          <div className='md:w-1/3'>
            <BudgetItem budget={budget} enableHover={0} />
            <button className='btn mt-4'>delete budget</button>

            <div className='space-y-4 flex flex-col mt-4'>
              <input 
                type='text'
                id='description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Description'
                required
                className='input input-bordered'
              />

              <input 
                type='number'
                id='amount'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Amount'
                required
                className='input input-bordered'
              />

              <button
                onClick={handleAddTransaction}
                className='btn'
              >
                Add Your Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  )
}

export default page
