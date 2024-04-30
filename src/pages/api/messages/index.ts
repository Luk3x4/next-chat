import prisma from "@/lib/prisma";
import { serverPusher } from "@/lib/pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions)

    if(!session){
        return res.status(401).json({   
            message: 'Unauthorized Access'
        })
    }

    switch(req.method){
        case 'POST':
            const {content, chatId, authorId} = JSON.parse(req.body);

            const message = await prisma.message.create({
                data: {
                    content,
                    author: {
                        connect: {
                            id: authorId
                        }
                    },
                    chat: {
                        connect: {
                            id: chatId
                        }
                    }
                },
                include: {
                    author: true
                }
            })

            serverPusher.trigger('chat', 'new-message', message);
            res.status(200).json({ok: true});
        break;
        case 'GET':
            const { skip, cId } = req.query

            const messages = await prisma.message.findMany({
                where: {
                    chat: {
                        id: parseInt(cId as any)
                    }
                },
                orderBy: {
                    id: 'desc'
                },
                take: 20,
                skip: parseInt(skip as any),
                include: {
                    author: true
                }
            })

            const messageCount = await prisma.message.count({
                where: {
                    chat: {
                        id: parseInt(cId as any)
                    }
                }
            })

            res.status(200).json({sentMessages: messages, messageCount});
        break;
    }
}