import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import prisma from "../prisma";
export const roomRouter = Router();

roomRouter.get('/all-rooms', authMiddleware, async (req, res) => {
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
                orderBy:{
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

roomRouter.get('/messages/:roomId', authMiddleware, async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const room = await prisma.room.findUnique({ where: { id: roomId }, select: {
            users: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            messages: {
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            }
        } });
        if(!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        if(!room.users || !room.users.some(user => user.id === req.user.id)) {
            res.status(403).json({ message: 'Not a member of this room' });
            return;
        }
        res.status(200).json({ messages: room.messages });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
})
