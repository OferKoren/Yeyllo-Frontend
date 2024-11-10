import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'
const UNSPLASH_ACCESS_KEY = 'anN0ohg_TPCWJd4ALToXR25XalJdkQBdFae7guKwQjE'
const QUERY = 'PATAGONIA'

export function EndlessPhotos({ boardBg, onChangeBg }) {
    const [photos, setPhotos] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const modalRef = useRef(null)

    // Function to fetch photos from Unsplash
    const fetchPhotos = async () => {
        if (loading) return
        setLoading(true)

        try {
            const response = await axios.get(UNSPLASH_SEARCH_URL, {
                params: {
                    client_id: UNSPLASH_ACCESS_KEY,
                    query: QUERY,
                    page: page,
                    per_page: 10,
                },
            })

            const newPhotos = response.data.results
            setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos.filter((newPhoto) => prevPhotos.every((photo) => photo.id !== newPhoto.id))])
        } catch (error) {
            console.error('Error fetching photos:', error)
        } finally {
            setLoading(false)
        }
    }

    // Fetch photos on component mount and when page changes
    useEffect(() => {
        fetchPhotos()
    }, [page])

    // Handle scroll event to detect if at bottom
    const handleScroll = () => {
        if (modalRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = modalRef.current
            const scrollBottom = scrollHeight - scrollTop - clientHeight

            if (scrollBottom <= 200 && !loading) {
                // Increment page to trigger fetching more photos
                setPage((prevPage) => prevPage + 1)
            }
        }
    }

    // Add scroll event listener when the component mounts
    useEffect(() => {
        const modalElement = modalRef.current
        if (modalElement) {
            modalElement.addEventListener('scroll', handleScroll)
        }
        return () => {
            if (modalElement) {
                modalElement.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])
    const { selected } = boardBg
    console.log(photos[0])
    return (
        <div className="more-bgs">
            <ul className="endless-photos">
                {photos.map((photo) => (
                    <li key={photo.id}>
                        <button style={{ backgroundImage: `url(${photo.urls.small})` }} className="bg-btn"></button>
                        {/* <div className="photo-card" style={{ position: 'relative' }}>
                            <div>{photo.user.name}</div>
                        </div> */}
                    </li>
                ))}
            </ul>
        </div>
    )
}
