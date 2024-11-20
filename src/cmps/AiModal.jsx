import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'

export function AiModal({ onCloseModal }) {

    const [topic, setTopic] = useState('')
    const navigate = useNavigate()

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value = ev.target.value

        switch (type) {
            case 'text':
                break
            case 'number': {
                value = +ev.target.value || ''
                break
            }
        }
        setTopic(value)
    }

    async function getPhotosArray(topic) {
        const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos'
        const UNSPLASH_ACCESS_KEY = 'anN0ohg_TPCWJd4ALToXR25XalJdkQBdFae7guKwQjE'

        const response = await axios.get(UNSPLASH_SEARCH_URL, {
            params: {
                client_id: UNSPLASH_ACCESS_KEY,
                query: topic,
                page: 1,
                per_page: 8,
            },
        })
        const newPhotos = response.data.results

        return newPhotos.map((photo) => photo.urls)
    }

    async function onGenerateAiBoard(ev) {
        ev.preventDefault()
        onCloseModal()
        try {
            const photos = await getPhotosArray(topic)
            const generatedBoard = await boardService.generateAiBoard(topic, photos)
            console.log('generatedBoard', generatedBoard)

            setTimeout(() => {
                navigate(`/board/${generatedBoard._id}`)
            }, 3000)

        } catch (err) {
            console.error('can not generate board', err)
        }
    }

    return (
        <div className="ai-modal-container">
            <h3>Create AI Board</h3>
            <form onSubmit={onGenerateAiBoard}>
                <label htmlFor="topic">Name the project you'd like to create</label>
                <input autoFocus className="ai-modal-input" type="text" id="topic" name="topic" value={topic} onChange={handleChange} />
                <button style={{ backgroundColor: '#579dff' }}>Create</button>
            </form>
        </div>
    )
}