'use client'
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '@clerk/nextjs'
import dynamic from 'next/dynamic';
import { addBudget } from '../action';
import Notification from '../components/Notification';
// import EmojiPicker from 'emoji-picker-react'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const page = () => {
  const { user } = useUser()
  // usestate
  const [budgetName, setBudgetName] = useState<string>("")
  const [budgetAmount, setBudgetAmount] = useState<string>("")
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string>("")

  const [notification, setNotification] = useState<string>("")
  const closeNotification = () => {
    // close notification
    setNotification("")
  }

  const handleEmojiSelect = (emojiObject : {emoji: string}) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false)
  }

  const handleAddBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount)

      if(isNaN(amount) || amount <= 0){
        throw new Error('The amount must be a positive number');
      }

      await addBudget (
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        selectedEmoji
      )

      const modal = document.getElementById('my_modal_3') as HTMLDialogElement;

      if(modal){
        modal.close()
      }

      setNotification('New budget has been created successfully.')
      setBudgetAmount("")
      setBudgetName("")
      setSelectedEmoji("")
      setShowEmojiPicker(false)
    } catch (error) {
      setNotification(`Error: ${error}`);
    }
  }

  return (
    <Wrapper>

      {notification && (
        <Notification message={notification} onclose={closeNotification}></Notification>
      )}

      {/* pop up dispolay after creating budget */}
      <button className="btn" onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>New Budget</button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Create A Budget</h3>
          <p className="py-4">Allows You To Easily Control Your Expenses</p>

          <div className="w-full flex flex-col">
            <input 
              type="text" 
              value={budgetName} 
              placeholder='Name the budget'
              onChange={(e) => setBudgetName(e.target.value)}
              className='input input-bordered mb-3'
              required 
            />

            <input 
              type="number" 
              value={budgetAmount} 
              placeholder='Amount for budget'
              onChange={(e) => setBudgetAmount(e.target.value)}
              className='input input-bordered mb-3'
              required 
            />

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className='btn mb-3 w-full flex'
            >
              {selectedEmoji || "select your emoji 😅"}
            </button>

            {showEmojiPicker && (
              <div className='flex justify-center items-center my-4'>
                <EmojiPicker 
                  onEmojiClick={handleEmojiSelect}
                />
              </div>
            )}

            <button 
              className='btn'
              onClick={handleAddBudget}
            >
              Add Budget
            </button>
          </div>
        </div>
      </dialog>
    </Wrapper>
  )
}

export default page
