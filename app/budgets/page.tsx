'use client'
import React, { useEffect } from 'react'
import { testConsole } from '../action';

const page = () => {
    useEffect(() => {
        // Wrap the async call inside a function
        const callTestConsole = async () => {
            await testConsole();
        };

        callTestConsole();
    }, []);

  return (
    <div>
      
    </div>
  )
}

export default page
