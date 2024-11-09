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
            console.log("Nouvel utilisateurs ajouter dans la base de données")
        }else{
            console.log("Cet utilisateur existe!!")
        }
    } catch (error) {
        console.error("Erreurs lors de la verification de l'utilisateur: ", error)
    }
    
}