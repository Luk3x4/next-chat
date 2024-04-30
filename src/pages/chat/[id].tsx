import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import prisma from "@/lib/prisma";
import type { InferGetServerSidePropsType } from "next";
import Error from "next/error";
import {clientPusher} from '@/lib/pusher';

export const getServerSideProps = async (context: any) => {
    const chat = await prisma.chat.findFirst({
        where: { 
            key: context.params.id
        },
        include: {
            messages: {
                take: 20,
                orderBy: {
                    id: 'desc'
                },
                include: {
                    author: true
                }
            }
        },
    })

    chat?.messages.forEach(item => {
        item.author.createdAt = new Date().toJSON() as any;
    })

    chat?.messages.reverse();

    return {
        props: {
            chat,
        }
    }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Chat({ chat }: Props) {
    const [text, setText] = useState('');
    const dummyRef = useRef<HTMLDivElement>(null!);
    const mainRef = useRef<HTMLDivElement>(null!);
    const [messages, setMessages] = useState<any>(chat?.messages);
    const [loading, setLoading] = useState(false)
    const [noMessagesLeft, setNoMessagesLeft] = useState(false)
    const { data: session, status } = useSession({
        required: true,
    });



    if(!chat){
        return <Error statusCode={404} />
    }
 

    //lazy loading messages
    function lazyLoad(e: any) {
        const scrollLevel = e.target.scrollTop;
        if(scrollLevel === 0 && !noMessagesLeft && !loading){
            setLoading(true)
            fetch(`/api/messages?skip=${messages.length}&cId=${chat?.id}`).then(res => res.json())
            .then(data => {
                const { sentMessages, messageCount} = data;

                setNoMessagesLeft(messageCount <= sentMessages.length + messages.length)
                setMessages((prev: any) => {
                    return [...sentMessages, ...prev].sort((a,b) => a.id - b.id)
                })
                setLoading(false);
            })
            .catch(() => {
                return
            })
        }
    }
    
    const scrollToBottom = () => dummyRef.current?.scrollIntoView({ behavior: 'smooth'})
    
    useEffect(() => {

        const channel = clientPusher.subscribe('chat');
        channel.bind('new-message', (message: any) => {
            setMessages((prev: any) => [...prev, message]);

            setTimeout(() => {
                scrollToBottom()
            }, 300)
        })
        return () => {
            channel.unsubscribe();
        }
    }, []);

    const handleClick = async () => {
        if(!text || text.length > 255) return;

        fetch('/api/messages', {
            method: "POST",
            body: JSON.stringify({
                content: text,
                authorId: (session?.user as any).id,
                chatId: chat.id
            })
        }).then(() => {
            return;
        }).catch(() => {
            return;
        })
        setText("");
    }

    function sendMessage(e: any) {
        if(e.key === "Enter"){
            handleClick();
        }else return;
    }

    if(status === 'loading'){
        return (
            <div> Loading...</div>
        )
    }

    return( 
        <div className="chat">
            <div className="main" onLoad={scrollToBottom} onScroll={lazyLoad} ref={mainRef}>
                {chat.messages && messages.map((item: any) => (
                    <div key={item.id} className={item.author.id === (session.user as any).id? 'message' : 'message received'}>
                        <div className="message-main">
                            <div className="message-inner">
                                <p>{item.content}</p>
                            </div>
                            <Image src={item.author.avatar} width={30} height={30} style={{objectFit: "cover"}} alt=""></Image>
                        </div>
                    </div>
                ))}
                <div className="dummy" ref={dummyRef}></div>
            </div>
            <div className="sender">
                <input type="text" value={text} onKeyDown={e => sendMessage(e)} onChange={(e) => setText(e.target.value)} placeholder="Type..."/>
                <button onClick={handleClick}>Send</button>
            </div>
        </div>
    )
}