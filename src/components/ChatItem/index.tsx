import styles from './chatItem.module.scss'

export default function ChatItem({name, chatKey, clickable}: any) {
    return (
        <div className={styles.item}>
            <a href={`/chat/${chatKey}`} style={{
                pointerEvents: `${clickable? 'all': 'none'}`
            }}>
                {name}
            </a>
        </div>
    )
}