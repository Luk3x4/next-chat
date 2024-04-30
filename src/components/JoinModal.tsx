import { useState } from "react";
import Modal from "./Modal";
import { useRouter } from "next/router";

export default function JoinModal({ handleClick }: {handleClick: () => void}) {
    const [key, setKey] = useState("")
    const router = useRouter();

    const joinChat = () => {
        router.push(`/chat/${key}`);
    }
    
    return (
        <Modal handleClick={handleClick}>
            <h1> Join Chat </h1>
            <div>
                <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder='Enter Key'/>
                <button onClick={joinChat}> Join </button>
            </div>
        </Modal>
    )
}