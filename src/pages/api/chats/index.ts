import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    
    if(!session) {
        res.status(401).json({msg: "Unauthorized"});
        return;
    }

    switch(req.method){
        case 'POST':
            const { name, key } = req.body;

            await prisma.chat.create({
                data: {
                    name,
                    key
                }
            })
            res.status(200).json({ ok: true });
        break;
        case 'GET':
            const userChats = await prisma.chat.findMany({
                where: {
                    messages: {
                        some: {
                            author: {
                                username: session?.user?.name!
                            }
                        }
                    }
                }
            })

            res.status(200).json(userChats)
        break;
    }
}