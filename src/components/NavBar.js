import styles from '@/styles/NavBar.module.css'
import { useRouter } from 'next/navigation'
import { Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({ subsets: ['latin'] })

function NavButton({ text, location }) {
    const router = useRouter()
    return (
        <button style={playfairDisplay.style}
            className={styles.navButton}
            onClick={() => router.push((location))}>
            {text}
        </button>
    )
}
const NavBar = () => {
    const router = useRouter()
    return (
        <div className={styles.navBar}>
            <div>
                <button style={playfairDisplay.style}
                    className={styles.logo}
                    onClick={() => router.push(('/'))}>
                    Insight Journal
                </button>
            </div>
            <div>
                <NavButton text='News' location='/news' />
                <NavButton text='Collections' location='/collections' />
                <NavButton text='Magazine' location='/magazine' />
            </div>
        </div>
    )
}
export default NavBar