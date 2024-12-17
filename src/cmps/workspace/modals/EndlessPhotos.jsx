import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

import { debounce } from '../../../services/util.service.js'

const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'
const UNSPLASH_ACCESS_KEY = 'anN0ohg_TPCWJd4ALToXR25XalJdkQBdFae7guKwQjE'

export function EndlessPhotos({ boardBg, onChangeBg, initQuery = 'patagonia' }) {
    const [photos, setPhotos] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const modalRef = useRef(null)
    const [query, setQuery] = useState('')

    function search(query) {
        setPhotos([])
        setPage(1)
        if (page === 1) {
            fetchPhotos(query)
        }
    }
    const debouncedFetchPhotos = useRef(debounce(search, 1000))
    async function fetchPhotos(query) {
        if (loading) return
        setLoading(true)

        try {
            const response = await axios.get(UNSPLASH_SEARCH_URL, {
                params: {
                    client_id: UNSPLASH_ACCESS_KEY,
                    query: query || initQuery,
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
        setQuery(() => target.value)
        /* setPhotos([])
        setPage(1)
    } */
    }

    useEffect(() => {
        fetchPhotos()
    }, [page])
    useEffect(() => {
        debouncedFetchPhotos.current(query)
    }, [query])

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
                                onChangeBg(photo.urls.regular, false, photo.urls)
                            }}
                        >
                            {selected === photo.urls.regular && <img src="/img/add-board/v-icon.svg" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
