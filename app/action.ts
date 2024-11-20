'use server'

import prisma from "@/lib/prisma"
import budgets from "./data"

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

export async function addTransactionsToBudget( 
    budgetId: string,
    amount: number,
    description: string
){
    try {
        // verify if budget exist
        const budget = await prisma.budget.findUnique({
            where: {
                id: budgetId
            },
            include: {
                transactions: true
            }
        })

        if(!budget){
            throw new Error('Budget not found');
        }

        const totalTransaction = budget.transactions.reduce((sum, transaction) =>{
            return sum + transaction.amount
        }, 0)

        const totalWithNewTransaction = totalTransaction + amount

        if(totalWithNewTransaction > budget.amount){
            throw new Error('The total amount of the transaction is higher than the initial budget amount.')
        }

        const newTransaction = await prisma.transaction.create({
            data: {
                amount,
                description,
                emoji: budget.emoji,
                budget: {
                    connect: {
                        id: budgetId
                    }
                }
            }
        })
    } catch (error) {
        console.error("Error occured during the creation of the Transaction: ", error);
        throw error;
    }
}

export async function deleteBudget( budgetId: string ){
    try {
        await prisma.transaction.deleteMany({
            where: {budgetId}
        })

        await prisma.budget.delete({
            where: {
                id: budgetId
            }
        })
    } catch (error) {
        console.error("An error occured when deleting the budget: ", error);
        throw error;
    }
}

export async function deleteTransaction( transactionId: string ){
    try {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id: transactionId
            }
        })

        if(!transaction){
            throw new Error('Transaction not found.');
        }

        await prisma.transaction.delete({
            where: {
                id: transactionId
            }
        })

    } catch (error) {
        console.error("An error occured when deleting the transaction: ", error);
        throw error;
    }
}

export async function getTransactionsByEmailAndPeriod( email: string, period: string ){
    try {
        const now = new Date();
        let dateLimit

        switch (period) {
            case 'last7':
                dateLimit = new Date(now);
                dateLimit.setDate(now.getDate() - 7);
                break;
            
            case 'last30':
                dateLimit = new Date(now);
                dateLimit.setDate(now.getDate() - 30);
                break;

            case 'last60':
                dateLimit = new Date(now);
                dateLimit.setDate(now.getDate() - 60);
                break;

            case 'last90':
                dateLimit = new Date(now);
                dateLimit.setDate(now.getDate() - 90);
                break;

            case 'last365':
                dateLimit = new Date(now);
                dateLimit.setDate(now.getFullYear() - 1);
                break;
        
            default:
                throw new Error('Invalid period');
                break;
        }

        // get user by email
        const user = await prisma.user.findUnique({
            where: {email},
            include: {
                budgets: {
                    include: {
                        transactions: {
                            where: {
                                createdAt: {
                                    gte: dateLimit
                                }
                            },

                            orderBy: {
                                createdAt: 'desc'
                            }
                        }
                    }
                }
            }
        })

        if(!user){
            throw new Error('User not found.');
        }

        const transactions = user.budgets.flatMap(budget =>
            budget.transactions.map(transaction => ({
                ...transaction,
                budgetName: budget.name,
                budgetId: budget.id
            }))
        )

        return transactions
    } catch (error) {
        console.error("An error occured when getting the transaction: ", error);
        throw error;
    }
}