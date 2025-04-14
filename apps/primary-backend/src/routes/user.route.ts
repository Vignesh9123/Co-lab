import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import prisma from "../prisma";
import { firebaseApp, setAndGetAccessToken } from "../config";
export const userRouter = Router();

userRouter.post('/google-auth', async (req, res)=>{
    try {
        const { idToken } = req.body;
        if(!firebaseApp){
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        const user = await prisma.user.findUnique({ where: { id: uid } });
        if(!user) {
            const newUser = await prisma.user.create({
                data: {
                    id: uid,
                    name: decodedToken.name,
                    email: decodedToken.email!,
                }
            });
            const accessToken = setAndGetAccessToken(res, uid);
            res.status(200).json({ message:"User logged in successfully", user: newUser, accessToken });
            return;
        }

        res.status(200).json({ message:"User logged in successfully",user });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
})

userRouter.get('/check-auth', authMiddleware, (req, res) => {
   try {
     res.status(200).json({ message: 'Authenticated' });
     return
   } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
   }
})

userRouter.get('/current-user', authMiddleware, async (req, res) => {
   try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: {
        id: true,
        name: true,
        email: true,
        rooms: {
            select:{
                id: true,
                name: true,
                createdAt: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        }
    } });
    if(!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }
    res.status(200).json({ user });
    return;
   } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
   }
})

userRouter.get('/current-user-rooms', authMiddleware, async (req, res) => {
   try {
    const userId = req.user.id;
    const rooms = await prisma.user.findUnique({ where: { id: userId }, select: {
        rooms: {
            select:{
                id: true,
                name: true,
                createdAt: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        },
    } });
    if(!rooms || !rooms.rooms) {
        res.status(404).json({ message: 'Rooms not found' });
        return;
    }
    res.status(200).json({ rooms: rooms.rooms });
    return;
   } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
   }
})