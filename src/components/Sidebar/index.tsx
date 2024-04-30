import { useEffect, useState } from 'react'
import styles from './sidebar.module.scss'
import axios from 'axios'
import ChatItem from '../ChatItem'

export default function Sidebar() {
    const [isOpened, setIsOpened] = useState(false)
    const [chats, setChats] = useState<any>([])

    useEffect(() => {
        async function getUserChats(){
            try{
                const res = await axios.get('/api/chats')
                setChats(res.data);
            }catch(err){}
        }
        getUserChats()
    }, [])

    const toggleSidebar = () => {
        setIsOpened(prev => !prev);
    }   

    return (
        <div className={`${styles.sidebar} ${isOpened ? 'opened' : ''}`}>
            <div className={styles.inner}>
                <h2> Chat List </h2>
                <span className="material-symbols-outlined" onClick={toggleSidebar}>menu</span>
            </div>
            <div className={styles.list}>
                {chats.map((item: any) => {
                    return (
                        <ChatItem key={item.id} chatKey={item.key} clickable={isOpened} name={item.name} />
                    )
                })}
            </div>
        </div>
    )
}