import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './navbar.module.scss';
import Link from 'next/link';

export default function Navbar() {
    const { data: session } = useSession();

    return ( 
        <div className={styles.nav}>
            <Link href="/"> Next-Chat </Link>
            <div className={styles.inner}>
                {!session && <button onClick={() => signIn('discord')}> Sign in </button>}
                {session && (
                    <>
                        <h3>Logged in as {session.user?.name} </h3>
                        <button onClick={() => signOut()}>Log out</button>
                    </>
                )}
            </div>
        </div>
    )
}