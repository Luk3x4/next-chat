import styles from '@/components/menu/menu.module.scss';
import CreateModal from '../CreateModal';
import JoinModal from '../JoinModal';
import { useState } from 'react';

export default function Menu() {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isJoinOpen, setIsJoinOpen] = useState(false)

    const close = (hider: React.Dispatch<React.SetStateAction<boolean>>) => {
        hider(false)
    }

    return (
        <div className={styles.main}>
            {isCreateOpen && <CreateModal handleClick={() => close(setIsCreateOpen)} />}
            {isJoinOpen && <JoinModal handleClick={() => close(setIsJoinOpen)} />}
            <div className={styles.btn}>
                <button onClick={() => setIsJoinOpen(prev => !prev)}>Join</button>
                <button onClick={() => setIsCreateOpen(prev => !prev)}>Create</button>
            </div>
        </div>
    )
}