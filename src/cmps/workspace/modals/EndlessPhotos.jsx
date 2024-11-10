import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { debounce } from '../../../services/util.service.js'

const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'
const UNSPLASH_ACCESS_KEY = 'anN0ohg_TPCWJd4ALToXR25XalJdkQBdFae7guKwQjE'

export function EndlessPhotos({ boardBg, onChangeBg }) {
    const [photos, setPhotos] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const modalRef = useRef(null)
    const [query, setQuery] = useState('')
    // Function to fetch photos from Unsplash
    function search(query) {
        console.log('boom')
        setPhotos([])
        setPage(1)
        if (page === 1) {
            fetchPhotos(query)
        } else console.log('df')
    }
    const debouncedFetchPhotos = useRef(debounce(search, 1000))
    async function fetchPhotos(query) {
        if (loading) return
        setLoading(true)
        console.log('fetching ', query)
        console.log('fetching ', page)
        try {
            const response = await axios.get(UNSPLASH_SEARCH_URL, {
                params: {
                    client_id: UNSPLASH_ACCESS_KEY,
                    query: query || 'patagonia',
                    page: page,
                    per_page: 12,
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
    function handleChange({ target }) {
        // console.log(target.value)
        setQuery(() => target.value)
        /* setPhotos([])
        setPage(1)
    } */
    }
    // Fetch photos on component mount and when page changes
    useEffect(() => {
        fetchPhotos()
        console.log('herhe')
    }, [page])
    useEffect(() => {
        debouncedFetchPhotos.current(query)
    }, [query])
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

    return (
        <div className="more-bgs ">
            <div className="photo-search-wrapper">
                <input type="text" className="input photo-search" placeholder="Photos" value={query} onChange={handleChange} />
                <img src="/img/general/search-icon.svg" alt="" />
            </div>
            <ul className="endless-photos" ref={modalRef}>
                {query === '' &&
                    boardBg.options.photos.map((photo) => {
                        return (
                            <li key={photo}>
                                <button
                                    type="button"
                                    style={{ backgroundImage: `url('${photo}')` }}
                                    className={selected === photo ? 'bg-btn btn2 active' : 'bg-btn btn2'}
                                    onClick={() => {
                                        onChangeBg(photo)
                                    }}
                                >
                                    {selected === photo && <img src="/img/add-board/v-icon.svg" />}
                                </button>
                            </li>
                        )
                    })}
                {photos.map((photo) => (
                    <li key={photo.id}>
                        <button
                            style={{ backgroundImage: `url(${photo.urls.small})` }}
                            className={selected === photo.urls.full ? 'bg-btn btn 2 active' : 'bg-btn btn2'}
                            onClick={() => {
                                onChangeBg(photo.urls.full)
                            }}
                        >
                            {selected === photo.urls.regular && <img src="/img/add-board/v-icon.svg" />}
                        </button>
                        {/* <div className="photo-card" style={{ position: 'relative' }}>
                            <div>{photo.user.name}</div>
                        </div> */}
                    </li>
                ))}
            </ul>
        </div>
    )
}
