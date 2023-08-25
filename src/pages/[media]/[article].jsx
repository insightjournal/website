import { database, storage } from '@/configFirebase'
import styles from '@/styles/Article.module.css'
import Layout from '@/components/Layout'
import { useWindowSize } from '@/components/Utilities'
import { getCountFromServer, query, collection, updateDoc, doc, getDoc, getDocs } from 'firebase/firestore'
import { useState, useEffect } from 'react'
import { Lato, Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({ subsets: ['latin'] })
const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] })

function Title({ text }) {
    return (
        <p className={styles.title}
            style={playfairDisplay.style}>
            {text}
        </p>
    )
}

function AuthorDate({ author, date }) {
    let text = author.toUpperCase() + ' | ' + date
    return (
        <p className={styles.authorDate}
            style={lato.style}>
            {text}
        </p>
    )
}

function Description({ text }) {
    return (
        <p className={styles.description}>
            {text}
        </p>
    )
}

function Analytics({ ID, likes, comments, type }) {
    const [newLikes, setNewLikes] = useState(likes)
    const [newComments, setNewComments] = useState(comments)
    return (
        <div>
            <hr className={styles.divider} style={{ marginTop: '15px' }} />
            <div style={{ display: 'inline' }}>
                <button className={styles.analyticsButton}
                    onClick={async (event) => {
                        const heart = event.currentTarget.firstElementChild
                        if (newLikes > likes) {
                            setNewLikes(newLikes - 1)
                            heart.style.objectPosition = '-25px -25px'
                            heart.style.left = '0px'
                        } else {
                            setNewLikes(newLikes + 1)
                            likes += 1
                            heart.style.objectPosition = '25px -25px'
                            heart.style.left = '-25px'
                        }
                        const docRef = doc(database, type, ID)
                        await updateDoc(docRef, { LIKES: likes })
                    }}>
                    <img src='/heart-icon.png' className={styles.likeImage} />
                    <p className={styles.likeNumber} style={lato.style}>{newLikes}</p>
                </button>
                {/*
                <button className={styles.analyticsButton}
                    onClick={async (event) => {
                        const comment = event.currentTarget.firstElementChild
                        if (newComments > comments) {
                            setNewComments(newComments - 1)
                            comment.style.objectPosition = '-34px 0px'
                            comment.style.left = '50px'
                        } else {
                            setNewComments(newComments + 1)
                            comments += 1
                            comment.style.objectPosition = '0px 0px'
                            comment.style.left = '50px'
                        }
                    }}>
                    <img src='/comment-icon.png' className={styles.commentImage}></img>
                    <p className={styles.commentNumber} style={lato.style}> {newComments}</p>
                </button>
                */ }
            </div>
            <hr className={styles.divider} style={{ position: 'relative', top: '-30px', marginBottom: '-15px' }} />
        </div>
    )
}

function CommentSection({ comments }) {
    let text = 'COMMENTS'
    if (comments.length == 1) {
        text = 'COMMENT'
    }
    return (
        <div style={{ marginTop: '50px' }}>
            <p className={lato.className} style={{ fontWeight: '700' }}>{comments.length} {text} </p>
            <div style={{ marginTop: '10px' }}>
                {comments.map((comment) => (
                    <div>
                        <hr className={styles.divider} />
                        <p className={styles.commentInfo} style={lato.style}>{comment.AUTHOR} | {comment.DATE}</p>
                        <p className={styles.commentText}>{comment.TEXT}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Details({ title, author, date, description, content }) {
    return (
        <div>
            <AuthorDate author={author} date={date} />
            <Title text={title} />
            <Description text={description} />
        </div>
    )
}

function Content({ text }) {
    return (
        <div dangerouslySetInnerHTML={{ __html: text }}></div>
    )
}

function CoverImage({ images }) {
    let coverImage = {}
    let coverExists = false
    const bucket = storage._bucket.bucket
    images.forEach((image) => {
        if (image.ID == 'cover-image') {
            coverExists = true
            coverImage = {
                IMAGE: image.IMAGE,
                ALT: image.ALT,
                CAPTION: image.CAPTION
            }
        }
    })
    const imageRef = 'https://firebasestorage.googleapis.com/v0/b/' + bucket + '/o/' + coverImage.IMAGE + '?alt=media'
    if (coverExists) {
        return (
            <div>
                <img src={imageRef}
                    className={styles.coverImage}
                    alt={coverImage.ALT}
                />
                <p className={styles.caption}>{coverImage.CAPTION}</p>
            </div>
        )
    }
}

export async function getStaticPaths() {
    let paramList = []
    const newsQuery = await getDocs(collection(database, 'news'))
    newsQuery.forEach((document) => {
        paramList.push({
            params: {media: 'news', article: document.id}
        })
    })
    const magazineQuery = await getDocs(collection(database, 'magazine'))
    magazineQuery.forEach((document) => {
        paramList.push({
            params: {media: 'magazine', article: document.id}
        })
    })
    return {
        paths: paramList,
        fallback: false
    }
}

export async function getStaticProps(context) {
    let articleData = {}
    const articleID = context.params.article
    const type = context.params.media
    const docRef = doc(database, type, articleID)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        articleData = {
            ID: articleID,
            TYPE: type,
            TITLE: docSnap.data().TITLE,
            AUTHOR: docSnap.data().AUTHOR,
            DATE: docSnap.data().DATE,
            DESCRIPTION: docSnap.data().DESCRIPTION,
            LIKES: docSnap.data().LIKES,
            CONTENT: docSnap.data().CONTENT,
            IMAGES: [],
            COMMENTS: []
        }
        const queryImages = query(collection(database, type, articleID, 'images'))
        const snapshotImages = await getCountFromServer(queryImages)
        if (snapshotImages.data().count > 0) {
            const querySnapshot = await getDocs(queryImages)
            querySnapshot.forEach((document) => {
                articleData.IMAGES.push({
                    ID: document.id,
                    IMAGE: document.data().IMAGE,
                    ALT: document.data().ALT,
                    CAPTION: document.data().CAPTION
                })
            })
        }
        //queryComments = query(collection(database, type, articleID, 'comments'))
        //const snapshotComments = await getCountFromServer(queryComments)
        //if (snapshotComments.data().count > 0) {
        //    const querySnapshot = await getDocs(queryComments)
        //    querySnapshot.forEach((document) => {
        //        articleData.COMMENTS.push({
        //            ID: document.id,
        //            AUTHOR: document.data().AUTHOR,
        //            DATE: document.data().DATE,
        //            TEXT: document.data().TEXT
        //        })
        //    })
        //}
    } else {
        // route to 404 not found
        console.log("No such document!");
    }
    return {
        props: articleData
    }
}

function Article(props) {
    let totalWidth = useWindowSize().width
    if (totalWidth <= 1000) {
        return (
            <Layout title={props.TITLE}>
                <div className={styles.main} style={{ display: 'inline-block' }}>
                    <Details title={props.TITLE} author={props.AUTHOR} date={props.DATE} description={props.DESCRIPTION} content={props.CONTENT} />
                    <Analytics ID={props.ID} likes={props.LIKES} type={props.TYPE} />
                    <Content text={props.CONTENT} />
                </div>
            </Layout>
        )
    } else {
        return (
            <Layout title={props.TITLE}>
                <div className={styles.body}>
                    <div className={styles.more}>
                    </div>
                    <div className={styles.main}>
                        <Details title={props.TITLE} author={props.AUTHOR} date={props.DATE} description={props.DESCRIPTION} content={props.CONTENT} />
                        <Analytics ID={props.ID} likes={props.LIKES} type={props.TYPE} />
                        <CoverImage images={props.IMAGES} />
                        <Content text={props.CONTENT} />
                    </div>
                    <div className={styles.more}>
                    </div>
                </div>
            </Layout>
        )
    }

}

export default Article
