import { useEffect, useRef, useState } from 'react'

export function BoardMenu() {
    const [width, setWidth] = useState('0px')
    useEffect(() => {
        setWidth('340px')
    }, [])
    return (
        <section className={'board-menu'} style={{ width: width || '0px' }}>
            menu
        </section>
    )
}
