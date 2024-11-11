'use server'

import prisma from "@/lib/prisma"

export async function checkAndAddUser( email: string | undefined ){
    if(!email) return

    try {
        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if(!existingUser){
            await prisma.user.create({
                data: {email}
            })
            console.log("New user added has been added to database")
        }else{
            console.log("This user already exists!!")
        }
    } catch (error) {
        console.error("An error occured during the verification of the user: ", error)
    }
    
}

export async function addBudget( email: string, name: string, amount: number, selectedEmoji: string ){
    try {
        // get user using email
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(!user){
            throw Error('User Not Found')
        }
    } catch (error) {
        console.error("Error occured during the creation of the Budget: ", error);
        throw error;
    }
}