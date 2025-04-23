import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function saveMessageToDB(message:string, userId:string, roomId:string) {
    await prisma.message.create({
        data:{
            content: message,
            userId: userId,
            roomId: roomId
        }
    });
}