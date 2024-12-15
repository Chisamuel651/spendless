'use client'
import { addTransactionsToBudget, deleteBudget, deleteTransaction, getTransactionsByBudgetId } from '@/app/action'
import BudgetItem from '@/app/components/budgetItems'
import Wrapper from '@/app/components/Wrapper'
import { Budget } from '@/type'
import React, { useEffect, useState } from 'react'
import Notification from '../../components/Notification';
import { Send, Trash } from 'lucide-react'
import { redirect } from 'next/navigation'

const Page = ({params} : {params: Promise<{budgetId: string}>}) => {

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
        console.log(newTransaction);

        setNotification('Transaction added successfully')
        fetchBudgetData(budgetId)

        setAmount('')
        setDescription('')
      } catch (error) {
        setNotification("You\'ve exceeded the budget amount.")
        console.log(error);
      }
    }

    const handleDeleteBudget = async () => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this Budget together with all it\'s transactions?"
      )

      if(confirmed){
        try {
          await deleteBudget(budgetId)
        } catch (error) {
          console.log('An error occured when deleting the budget: ', error);
        }

        redirect('/budgets')
      }
    }

    const handleDeleteTransaction = async (transactionId: string) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this Transaction?"
      )

      if(confirmed){
        try {
          await deleteTransaction(transactionId)
          fetchBudgetData(budgetId);
          setNotification('Transactiond deleted')
        } catch (error) {
          console.log('An error occured when deleting the transaction: ', error);
        }
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
            <button 
              className='btn mt-4'
              onClick={() => handleDeleteBudget()}
            >
              delete budget
            </button>

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

          {
            budget?.transactions && budget?.transactions.length > 0 ?(
              <div className="overflow-x-auto md:mt-0 mt-4 md:w-2/3 ml-4">
                <table className="table table-zebra">
                  {/* head */}
                  <thead>
                    <tr>
                      <th></th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budget?.transactions?.map((transaction) => (
                      <tr key={transaction.id}>
                        <th className='text-lg md:text-3xl'>{transaction.emoji}</th>
                        <td>
                          <div className="badge badge-accent badge-xs md:badge-sm"> - {transaction.amount} XAF</div>
                        </td>
                        <td>{transaction.description}</td>
                        <td>{transaction.createdAt.toLocaleDateString("fr-FR")}</td>
                        <td>{transaction.createdAt.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: '2-digit'
                        })}</td>
                        <td>
                          <button className='btn btn-sm' onClick={() => handleDeleteTransaction(transaction.id)}>
                            <Trash className='w-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ): (
              <div className='md:w-2/3 mt-10 md:ml-4 flex items-center justify-center'>
                <Send className='w-8 h-8 text-accent' strokeWidth={1.6} />
                <span className='text-gray-500 ml-2'>no transaction</span>
              </div>
            )
          }
        </div>
      )}
    </Wrapper>
  )
}

export default Page
