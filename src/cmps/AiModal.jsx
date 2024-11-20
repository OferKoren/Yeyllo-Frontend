import { useState } from "react"

export function AiModal() {

    const [topic, setTopic] = useState('')

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

    return (
        <div className="ai-modal-container">
            <h3>Create AI Board</h3>
            <form onSubmit={''}>
                <label htmlFor="topic">Name the project you'd like to create</label>
                <input autoFocus className="ai-modal-input" type="text" id="topic" name="topic" value={topic} onChange={handleChange} />
                <button style={{ backgroundColor: '#579dff' }}>Create</button>
            </form>
        </div>
    )
}