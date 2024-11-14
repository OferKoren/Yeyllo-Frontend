import ColorThief from 'colorthief'
import { useEffect, useState, useRef } from 'react'

export function Cover({ setTask, handleCloseModal, task }) {

    const colorPalette = [
        '#4BCE97', '#F5CD47', '#FEA362', '#F87168', '#9F8FEF',
        '#579DFF', '#6CC3E0', '#94C748', '#E774BB', '#8590A2']

    const bgImagesRef = useRef([
        { url: '/img/cover-bgImage/bennie-bates-szB1lzIzdpw-unsplash.jpg', id: 'img001' },
        { url: '/img/cover-bgImage/marek-piwnicki-5ojcSbYw-qA-unsplash.jpg', id: 'img002' },
        { url: '/img/cover-bgImage/marek-piwnicki-w6Qhc3Xid4M-unsplash.jpg', id: 'img003' },
        { url: '/img/cover-bgImage/mo-GLjekdIJftQ-unsplash.jpg', id: 'img004' },
        { url: '/img/cover-bgImage/mo-J36IsMgFjbY-unsplash.jpg', id: 'img005' },
        { url: '/img/cover-bgImage/mo-Q-yrZIjmBmE-unsplash.jpg', id: 'img006' }
    ])

    const [bgImages, setBgImages] = useState([...bgImagesRef.current])

    useEffect(() => {
        setBgColors()
    }, [])

    function setBgColors() {
        const colorThief = new ColorThief()

        bgImagesRef.current.forEach((imgObj) => {
            const img = new Image()
            img.crossOrigin = 'Anonymous'
            img.src = imgObj.url

            img.onload = () => {
                const [r, g, b] = colorThief.getColor(img)
                imgObj.bgColor = `rgb(${r}, ${g}, ${b}, 0.7)`

                setBgImages([...bgImagesRef.current])
            }
        })
    }

    function onSetCover(cover, type) {
        if (type === 'color') {
            setTask(prevTask => {
                if (prevTask.style?.backgroundImage) {
                    const updatedAttachments = prevTask.attachments.map(file =>
                        (file.id === prevTask.style.backgroundImage.imgId ? { ...file, isCover: false } : file))
                    return { ...prevTask, attachments: updatedAttachments, style: { backgroundColor: cover } }
                }
                return ({ ...prevTask, style: { backgroundColor: cover } })
            })
        } else {
            // setTask(prevTask => ({ ...prevTask, style: { backgroundImage: { ...cover } } }))
            setTask(prevTask => {

                if (cover.source === 'fromAttach') {
                    const updatedAttachments = prevTask.attachments.map(file =>
                        (file.id === cover.imgId ? { ...file, isCover: true } : file)
                    )
                    return { ...prevTask, attachments: updatedAttachments, style: { backgroundImage: { ...cover } } }
                }
                return { ...prevTask, style: { backgroundImage: { ...cover } } }
            })
        }
    }

    function onRemoveCover() {
        setTask(prevTask => {
            const updatedTask = { ...prevTask }
            if (prevTask.style.backgroundColor) {
                delete updatedTask.style
                return updatedTask
            } else {
                if (prevTask.style.backgroundImage.source === 'fromAttach') {
                    const updatedAttachments = updatedTask.attachments.map(file =>
                        (file.id === prevTask.style.backgroundImage.imgId ? { ...file, isCover: false } : file)
                    )
                    delete updatedTask.style
                    return { ...updatedTask, attachments: updatedAttachments }
                }
                delete updatedTask.style
                return { ...updatedTask }


                // const updatedAttachments = updatedTask.attachments.map(file =>
                //     (file.id === prevTask.style.backgroundImage.imgId ? { ...file, isCover: false } : file)
                // )
                // delete updatedTask.style
                // return { ...updatedTask, attachments: updatedAttachments }
            }
        })
    }


    return (
        <div className="modal-option task-labels">
            <div className="task-labels-header option-modal-header">
                <h2>Cover</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="cover-colors">
                <button className="btn btn-remove-cover-color btn-clear" onClick={() => onRemoveCover()}>Remove cover</button>
                <div>
                    <h3>Colors</h3>
                    <div className="color-palette">

                        {colorPalette.map(color =>
                            <div key={color} style={{ backgroundColor: color }}
                                onClick={() => onSetCover(color, 'color')}></div>
                        )}
                    </div>
                </div>

                {task.attachments?.length > 0 &&
                    <div className="img-attachments">
                        <h3>Attachments</h3>
                        <div className="img-attachments-list">
                            {task.attachments.map(file =>
                                <div key={file.id} className={`attachment-thumbnail`}
                                    style={{
                                        backgroundImage: `url(${file.url})`,
                                        backgroundColor: file.bgColor || 'rgb(154, 139, 127)',
                                        height: '50px',
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => onSetCover({ url: `url(${file.url})`, bgColor: file.bgColor, imgId: file.id, source: 'fromAttach' }, 'image')}>
                                </div>
                            )}
                        </div>
                    </div>
                }

                <div>
                    <h3>Photos from Unsplash</h3>
                    <div className="images-palette">
                        {bgImages.map(img =>
                            <div key={img.id}

                                style={{
                                    backgroundImage: `url(${img.url})`,
                                    backgroundColor: img.bgColor || 'rgb(154, 139, 127)',
                                    height: '50px',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                                onClick={() => onSetCover({ url: `url(${img.url})`, bgColor: img.bgColor, imgId: img.idת, source: 'fromSplash' }, 'image')}></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}