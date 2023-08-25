import { database, storage } from '@/configFirebase'
import Layout from '@/components/Layout'
import styles from '@/styles/Home.module.css'
import { collection, query, doc, getDoc, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { Arrow, Header, Date, Title, Description } from '@/components/Utilities'
import { Lato, Playfair_Display } from 'next/font/google'
import { useRouter } from 'next/navigation'

const lato = Lato({ subsets: ['latin'], weight: '700' })
const playfairDisplay = Playfair_Display({ subsets: ['latin'] })

function Featured() {
    return (
        <div className={styles.featuredContainer}>
            <Arrow direction='left' />
            <div className={styles.featuredImage}>

            </div>
            <Arrow direction='right' />
        </div>
    )
}

function ContentDiv({ type, title, date, author, description, id, image }) {
    const router = useRouter()
    const bucket = storage._bucket.bucket
    const imageRef = 'https://firebasestorage.googleapis.com/v0/b/' + bucket + '/o/' + image.NAME + '?alt=media'
    if (typeof date != 'undefined') {
        return (
            <div className={styles.articleContainer} onClick={() => {
                router.push({
                    pathname: '/[media]/[article]',
                    query: { media: type, article: id }
                })
            }}>
                <img src={imageRef}
                    className={styles.image}
                    alt={image.ALT}
                />
                <Date date={date} author={author} />
                <Title text={title} />
                <Description text={description} />
            </div>
        )
    } else {
        return (
            <div className={styles.articleContainer} onClick={() => {
                router.push({
                    pathname: '/[media]/[article]',
                    query: { media: type, article: id }
                })
            }}>
                <img src={imageRef}
                    className={styles.image}
                    alt={image.ALT}
                />
                <Title text={title} />
                <Description text={description} />
            </div>
        )
    }
}

function RenderContent({ type }) {
    const [articleData, setArticleData] = useState([])
    const fetchArticles = async () => {
        const q = query(collection(database, type))
        const querySnapshot = await getDocs(q)
        if (type == 'collection') {
            querySnapshot.forEach(async (document) => {
                const imageRef = doc(database, type, document.id, 'images', 'cover-image')
                const imageSnap = await getDoc(imageRef)
                setArticleData(data => [...data, {
                    ID: document.id,
                    TITLE: document.data().TITLE,
                    DESCRIPTION: document.data().DESCRIPTION,
                    IMAGE: {
                        ALT: imageSnap.data().ALT,
                        NAME: imageSnap.data().IMAGE
                    }
                }])
            })
        } else {
            querySnapshot.forEach(async (document) => {
                const imageRef = doc(database, type, document.id, 'images', 'cover-image')
                const imageSnap = await getDoc(imageRef)
                setArticleData(data => [...data, {
                    ID: document.id,
                    TITLE: document.data().TITLE,
                    AUTHOR: document.data().AUTHOR,
                    DATE: document.data().DATE,
                    DESCRIPTION: document.data().DESCRIPTION,
                    IMAGE: {
                        ALT: imageSnap.data().ALT,
                        NAME: imageSnap.data().IMAGE
                    }
                }])
            })
        }
    }
    useEffect(() => {
        fetchArticles()
    }, [])
    return (
        <div className={styles.contentContainer}>
            {articleData.map((article) => (
                <ContentDiv title={article.TITLE}
                    date={article.DATE}
                    author={article.AUTHOR}
                    description={article.DESCRIPTION}
                    type={type}
                    key={article.ID}
                    id={article.ID}
                    image={article.IMAGE}
                />
            ))}
        </div>
    )
}

function scroll(event, direction) {
    let scrollFactor = 300;
    let contentContainer = event.currentTarget.previousSibling
    if (direction == 'left') {
        scrollFactor = -scrollFactor
        contentContainer = event.currentTarget.nextSibling
    }
    contentContainer.scrollBy({
        top: 0,
        left: scrollFactor,
        behavior: 'smooth'
    })
}

function Section({ header, section }) {
    const [scrollFactor, setScrollFactor] = useState(0)
    return (
        <div className={styles.sectionContainer}>
            <Header text={header} />
            <div className={styles.arrowContainer}>
                <Arrow section={section} direction='left' onClick={(e) => scroll(e, 'left')} />
                <RenderContent type={section} />
                <Arrow section={section} direction='right' onClick={(e) => scroll(e, 'right')} />
            </div>
        </div>
    )
}

function Home() {
    return (
        <Layout title='Home'>
            <Featured />
            <Section header='Recent News' section='news' />
            <Section header='New Collections' section='collections' />
            <Section header='Literary Magazine' section='magazine' />
        </Layout>
    )
}

export default Home
