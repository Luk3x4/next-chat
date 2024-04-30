import { useSession } from 'next-auth/react';
import styles from './modal.module.scss' 

export default function Modal({children, handleClick}: {children: React.ReactNode, handleClick: () => void}) {
    const {data: session} = useSession();


    return (
        <div className={styles.container}>
            <div className={styles.modal}>
                <span className="material-symbols-outlined" onClick={handleClick}>
                    close
                </span>
                <div style={{height: '100%', padding: 0}}>
                    {!session ?<h1 style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}> Authenticate First! </h1> : children } 
                </div>
            </div>
        </div>
    );
}