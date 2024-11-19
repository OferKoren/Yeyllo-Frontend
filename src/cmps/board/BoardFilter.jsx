import { useState, useEffect } from 'react'
import { setFilterBy } from '../../store/actions/board.actions'

export function BoardFilter({ filterBy }) {
    const [filterToEdit, setFilterToEdit] = useState({ ...filterBy })

    useEffect(() => {
        // console.log(filterToEdit)
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name

        let value = ev.target.value

        switch (type) {
            case 'text':
            case 'radio':
                break
            case 'number':
                value = +ev.target.value || ''
                break
        }
        setFilterToEdit({ ...filterToEdit, [field]: value })
    }
    if (!filterBy) return
    const { keyword } = filterToEdit
    return (
        <section className="board-filter">
            <div>Keyword</div>
            <input type="text" name="keyword" className="input" value={keyword} onChange={handleChange} />
            <div>Search cards, members, labels, and more.</div>
            <div>Memebers</div>
        </section>
    )
}
