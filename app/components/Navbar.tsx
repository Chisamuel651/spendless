'use client'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { checkAndAddUser } from '../action'

const Navbar = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        if(user?.primaryEmailAddress?.emailAddress){
            checkAndAddUser(user?.primaryEmailAddress?.emailAddress)
        }
    }, [user])

  return (
    <div className='bg-base-200/30 px-5 md:px-[10%] py-4'>
      {isLoaded && (
        (isSignedIn ? (
            // if user is authenticated
            <>
                <div className="flex justify-between items-center">
                    <div className='flex md:text-2xl text-1xl items-center font-bold'>
                        <Link href={'/'}>spend<span className='text-accent'>.Less</span></Link>
                    </div>

                    <div className="md:flex hidden">
                        <Link className='btn' href={'/budgets'}>Mes budgets</Link>
                        <Link className='btn mx-4' href={''}>Tableau de bord</Link>
                        <Link className='btn' href={''}>Mes transactions</Link>
                    </div>

                    <UserButton />
                </div>

                {/* mobile responsiveness */}
                <div className="md:hidden flex mt-2 justify-center space-x-2">
                    <Link className='btn btn-xs' href={'/budgets'}>Mes budgets</Link>
                    <Link className='btn mx-2 btn-xs' href={''}>Tableau de bord</Link>
                    <Link className='btn btn-xs' href={''}>Mes transactions</Link>
                </div>
                
            </>
        ) : (
            // if user is noy authenticated
            <div className='flex items-center justify-between'>
                <div className='flex md:text-2xl text-1xl items-center font-bold'>
                    spend<span className='text-accent'>.Less</span>
                </div>

                <div className="flex mt-2 justify-center">
                    <Link className='btn btn-sm' href={'/sign-in'}>Se connecter</Link>
                    <Link className='btn mx-4 btn-sm btn-accent' href={'/sign-up'}>S'inscire</Link>
                </div>
            </div>
        ))
      )}
    </div>
  )
}

export default Navbar
