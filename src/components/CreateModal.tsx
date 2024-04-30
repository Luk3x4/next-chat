import { useState } from "react";
import Modal from "./Modal";
import axios from 'axios';
import { useRouter } from "next/router";

export default function CreateModal({handleClick}: {handleClick: () => void}) {
    const [chatName, setChatName] = useState('');
    const router = useRouter()

    const randomString = () => {
        const symbols = 'abcdefghijklmnopqrstuvwxyz0123456789'
        let randString = ''
        for(let i = 0; i < 10; i++){
            randString += symbols[Math.floor(Math.random() * symbols.length)]
        }
        return randString
    }

    const createChat = async () => {
        const randString = randomString();

        try{
            await axios.post('/api/chats',{
                name: chatName,
                key: randString
            });
        }catch(err){
            console.log(err);
        }

        router.push(`/chat/${randString}`);
    }

    return ( 
        <Modal handleClick={handleClick}>
            <h1> Create Chat </h1>
            <div>
                <input value={chatName} onChange={(e) => setChatName(e.target.value)} type="text" placeholder='Chat name'/>
                <button onClick={createChat}> Create </button>
            </div>
        </Modal>
    )
}