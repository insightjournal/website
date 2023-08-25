import styles from '@/styles/Footer.module.css'
import { Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({ subsets: ['latin'] })

function Footer() {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <button className={styles.branding}
                    style={playfairDisplay.style}>
                    Insight Journal
                </button>
                <p className={styles.description}>
                    Description of website
                </p>
                <p className={styles.copyright}
                    style={playfairDisplay.style}>
                    &#169;Insight Journal. All rights reserved.
                </p>
            </div>

        </div>
    )
}

export default Footer