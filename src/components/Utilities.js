import { database } from '@/configFirebase'
import styles from '@/styles/Utilities.module.css'
import { getCountFromServer, collection } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { Lato, Playfair_Display } from 'next/font/google'

const lato = Lato({ subsets: ['latin'], weight: '700' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'] })

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    })
    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        return () => window.removeEventListener("resize", handleResize)
    }, [])
    return windowSize;
}

export function Arrow({ section, direction, onClick }) {
    let style = styles.leftArrow
    let visible = 'visible'
    if (direction == 'right') {
        style = styles.rightArrow
    }
    if (typeof section != 'undefined') {
        const [contentCount, setContentCount] = useState(0)
        const fetchCount = async () => {
            const articles = collection(database, section)
            const snapshot = await getCountFromServer(articles)
            const count = snapshot.data().count
            setContentCount(count)
        }
        useEffect(() => {
            fetchCount()
        }, [])
        let totalWidth = useWindowSize().width
        if (contentCount * 350 < totalWidth) {
            visible = 'hidden'
        }
    }
    return (
        <button
            className={styles.emptyButton}
            onClick={onClick}
            style={{ visibility: visible }}>
            <div className={style}></div>
        </button>
    )
}

export function Header({ text }) {
    return (
        <p style={playfairDisplay.style}
            className={styles.header}>
            {text}
        </p>
    )
}

export function Date({ date, author }) {
    let fullAuthor = author
    let text
    if (typeof author != 'undefined' && typeof date != 'undefined') {
        let words = author.toUpperCase().split(' ')
        author = words[0].substring(0, 1) + '. ' + words[1]
        text = author + ' | ' + date
    }
    return (
        <p style={lato.style}
            title={fullAuthor}
            className={styles.date}>
            {text}
        </p>
    )
}

export function Title({ text }) {
    let fullText = text
    return (
        <p style={playfairDisplay.style}
            title={fullText}
            className={styles.title}>
            {text}
        </p>
    )
}

export function Description({ text }) {
    return (
        <div>
            <p className={styles.description}>{text}</p>
            <button className={styles.readMore}><u>Read more</u> &rarr;</button>
        </div>
    )
}