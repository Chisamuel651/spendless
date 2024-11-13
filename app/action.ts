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

        await prisma.budget.create({
            data: {
                name,
                amount,
                emoji : selectedEmoji,
                userId: user.id
            }
        })
    } catch (error) {
        console.error("Error occured during the creation of the Budget: ", error);
        throw error;
    }
}

export async function getBudgetsByUser( email: string ){
    try {
        const user = await prisma.user.findUnique({
            where: {email},
            include: {
                budgets: {
                    include: {
                        transactions: true,
                    }
                }
            }
        });

        if(!user){
            throw Error('User Not Found')
        }

        return user.budgets

    } catch (error) {
        console.error("Error occured during the creation of the Budget: ", error);
        throw error;
    }
}

export async function getTransactionsByBudgetId( budgetId: string ){
    try {
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include: {
                transactions: true
            }
        })

        if(!budget){
            throw Error('Budget Not Found')
        }

        return budget;
    } catch (error) {
        console.error("An error occured: ", error);
        throw error;
    }
}