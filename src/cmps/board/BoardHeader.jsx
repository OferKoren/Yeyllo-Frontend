import { useEffect, useRef, useState } from 'react'
import ClickOutside from '../ClickOutside'
import { Modal } from '../Modal'
import { BoardFilter } from './BoardFilter'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { LongTxt } from '../LongTxt.jsx'
import { AiModal } from '../AiModal'
import { ModalTaskDetails } from '../ModalTaskDetails.jsx'

const starEmpty = '/img/workspace/star-empty-small.svg'
const starEmptyGold = '/img/workspace/star-empty-gold.svg'
const starFullGold = '/img/workspace/star-full-gold.svg'
export function BoardHeader({ board, onUpdateBoard, onToggleMenu, setIsShrink, isMenuOpen, filterBy, openAiModal }) {
    const [isEditing, setIsEditing] = useState(false)
    const [text, setText] = useState() // Initial text for the header
    const inputRef = useRef(null)
    const headerRef = useRef(null)
    const spanRef = useRef(null)
    const [textWidth, setTextWidth] = useState(0)
    const [chosenModal, setChosenModal] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [position, setPosition] = useState()
    // Toggle to edit mod
    useEffect(() => {
        if (board) {
            setText(board.title)
        }
    }, [board.title])

    useEffect(() => {
        if (!headerRef.current) return
        if (isModalOpen) headerRef.current.style.zIndex = '5'
        else headerRef.current.style.zIndex = '3'
    }, [isModalOpen])

    function handleHeaderClick() {
        setIsEditing(true)
    }

    // Update text and exit edit mode
    function handleBlur() {
        setIsEditing(false)
        const boardToUpdate = { ...board }
        if (text !== '') {
            boardToUpdate.title = text
            onUpdateBoard(boardToUpdate)
        } else {
            setText(board.title)
        }
    }

    function handleInputChange() {
        // Get the width of the input's text
        if (inputRef.current) {
            setTextWidth(inputRef.current.scrollWidth)
        }
    }

    function onCloseModal() {
        setIsModalOpen(false)
    }
    function onOpenModal(modal) {
        setChosenModal(modal)
        setIsModalOpen(true)
    }

    function onSetPosition(ev) {
        // Get button position
        const rect = ev.currentTarget.getBoundingClientRect()
        setPosition({ right: 0, top: rect.bottom - 38 })
    }

    function updateTextWidht(text) {
        if (spanRef.current) {
            spanRef.current.textContent = text || ''
            const width = spanRef.current.offsetWidth

            setTextWidth(width * 1.05 + 15) //
        }
    }

    function onStarBoard(ev) {
        ev.stopPropagation()
        const boardToUpdate = { ...board }
        boardToUpdate.isStarred = !boardToUpdate.isStarred
        onUpdateBoard(boardToUpdate)
    }
    useEffect(() => {
        updateTextWidht(text)
    }, [isEditing, text])
    /*     useEffect(() => {
        console.log(textWidth)
    }, [textWidth]) */
    if (!board._id) return

    function copyUrl() {
        try {
            const copyText = window.location.href
            navigator.clipboard.writeText(copyText)
            showSuccessMsg('URL copied to clipboard!')
        } catch (err) {
            console.error('Error, problem copy url to clipboard:', err)
            showErrorMsg('Problem copy url to clipboard')
        }
    }

    return (
        <header className="board-header flex" ref={headerRef}>
            <div className="board-header-left-side">
                <div className="title-wrapper" style={{ width: `${textWidth + 10}px` }}>
                    {isEditing ? (
                        <input
                            className="title-input"
                            ref={inputRef}
                            type="text"
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value)
                                handleInputChange()
                            }}
                            onFocus={() => {
                                setTimeout(() => {
                                    inputRef.current.select()
                                }, 10)
                            }}
                            style={{ width: `${textWidth}px` }}
                            onBlur={handleBlur} // Exit edit mode when focus is lost
                            autoFocus
                        />
                    ) : (
                        <h3 ref={headerRef} onClick={handleHeaderClick} className="title-text">
                            {text?.trim() || 'Add title'}
                            {/* <LongTxt showButton={false} length={25}>{text?.trim() || 'Add title'}</LongTxt> */}
                        </h3>
                    )}
                </div>
                <span ref={spanRef} className="text-measurer" />

                <button className="header-btn btn2 star" onClick={(ev) => onStarBoard(ev, board)}>
                    {board.isStarred ? <StarFull /> : <StarEmpty />}
                </button>

            </div>

            <div className="board-header-right-side">

                <button
                    className="header-btn btn2 ai flex align-center"
                    onClick={(ev) => {
                        openAiModal()
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 318.2022471910112 323.33333333333337"
                        style={{ maxHeight: '500px', fill: 'currentcolor' }}
                        width="16"
                        height="16"
                    >
                        <path d="m367.44 153.84c0 52.32 33.6 88.8 80.16 88.8s80.16-36.48 80.16-88.8-33.6-88.8-80.16-88.8-80.16 36.48-80.16 88.8zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68z" />
                        <path d="m614.27 242.64c35.28 0 55.44-29.76 55.44-65.52s-20.16-65.52-55.44-65.52c-16.32 0-28.32 6.48-36.24 15.84v-13.44h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48z" />
                        <path d="m747.65 242.64c25.2 0 45.12-13.2 54-35.28l-24.72-9.36c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16s-60 28.56-60 65.52c0 38.88 25.2 65.52 61.2 65.52zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92z" />
                        <path d="m823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88v74.64h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84v-13.44h-28.8z" />
                        <path d="m1014.17 67.68-65.28 172.32h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32zm16.8 34.08 27.36 72h-54.24z" />
                        <path d="m1163.69 68.18h-30.72v172.32h30.72z" />
                        <path d="m297.06 130.97c7.26-21.79 4.76-45.66-6.85-65.48-17.46-30.4-52.56-46.04-86.84-38.68-15.25-17.18-37.16-26.95-60.13-26.81-35.04-.08-66.13 22.48-76.91 55.82-22.51 4.61-41.94 18.7-53.31 38.67-17.59 30.32-13.58 68.54 9.92 94.54-7.26 21.79-4.76 45.66 6.85 65.48 17.46 30.4 52.56 46.04 86.84 38.68 15.24 17.18 37.16 26.95 60.13 26.8 35.06.09 66.16-22.49 76.94-55.86 22.51-4.61 41.94-18.7 53.31-38.67 17.57-30.32 13.55-68.51-9.94-94.51zm-120.28 168.11c-14.03.02-27.62-4.89-38.39-13.88.49-.26 1.34-.73 1.89-1.07l63.72-36.8c3.26-1.85 5.26-5.32 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97zm-128.84-55.03c-7.03-12.14-9.56-26.37-7.15-40.18.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83l-64.41 37.19c-28.69 16.52-65.33 6.7-81.92-21.95zm-16.77-139.09c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91-26.93 15.55c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94-7.01 12.14-18.05 21.44-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8c-3.23-1.89-7.23-1.89-10.47 0l-77.79 44.92v-31.1c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22 6.99 12.12 9.52 26.31 7.15 40.1zm-168.51 55.43-26.94-15.55c-.29-.14-.48-.42-.52-.74v-74.39c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07l-63.72 36.8c-3.26 1.85-5.26 5.31-5.24 9.06l-.04 89.79zm14.63-31.54 34.65-20.01 34.65 20v40.01l-34.65 20-34.65-20z" />
                    </svg>
                    <span className="filter-btn-txt">Create AI Board</span>
                </button>

                <button
                    className="header-btn btn2 filters"
                    onClick={(ev) => {
                        onOpenModal('filters')
                        if (!isModalOpen) {
                            onSetPosition(ev)
                        }
                    }}
                >
                    <span>
                        <FilterIcon />
                    </span>
                    <span className="filter-btn-txt">Filters</span>
                </button>
                <span className="divider"></span>
                <div className="board-members">
                    {board.members.map((member) => (
                        <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                    ))}
                </div>

                <button style={{ gap: '0.4em' }} className="share header-btn btn2 flex align-center" onClick={copyUrl}>
                    {/* <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23858 3 7 5.23858 7 8C7 9.44777 7.61532 10.7518 8.59871 11.6649C5.31433 13.0065 3 16.233 3 20C3 20.5523 3.44772 21 4 21H12C12.5523 21 13 20.5523 13 20C13 19.4477 12.5523 19 12 19H5.07089C5.55612 15.6077 8.47353 13 12 13ZM15 8C15 9.65685 13.6569 11 12 11C10.3431 11 9 9.65685 9 8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8Z"
                            fill="currentColor"
                        />
                        <path
                            d="M17 14C17 13.4477 17.4477 13 18 13C18.5523 13 19 13.4477 19 14V16H21C21.5523 16 22 16.4477 22 17C22 17.5523 21.5523 18 21 18H19V20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20V18H15C14.4477 18 14 17.5523 14 17C14 16.4477 14.4477 16 15 16H17V14Z"
                            fill="currentColor"
                        />
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16" fill="currentColor">
                        <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
                    </svg>
                    <span>Share</span>
                </button>

                {!isMenuOpen && (
                    <button
                        className="header-btn btn2 menu"
                        onClick={() => {
                            onToggleMenu()
                            // if (isMenuOpen) setIsShrink(true)
                        }}
                    >
                        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {isModalOpen && chosenModal === 'filters' && (
                <ClickOutside onClick={onCloseModal} className={'absoluteapp'}>
                    <Modal
                        title={'filter'}
                        onCloseModal={onCloseModal}
                        isOpen={isModalOpen}
                        isBlur={false}
                        position={position}
                        isBackDrop={false}
                        style={{ width: '380px' }}
                    >
                        <BoardFilter filterBy={filterBy} board={board} />
                    </Modal>
                </ClickOutside>
            )}
        </header>
    )

    function StarEmpty() {
        return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }
    function StarFull() {
        return (
            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }
    function FilterIcon() {
        return (
            <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.61799 6C3.87461 6 3.39111 6.78231 3.72356 7.44721L3.99996 8H20L20.2763 7.44721C20.6088 6.78231 20.1253 6 19.3819 6H4.61799ZM10.8618 17.7236C10.9465 17.893 11.1196 18 11.309 18H12.6909C12.8803 18 13.0535 17.893 13.1382 17.7236L14 16H9.99996L10.8618 17.7236ZM17 13H6.99996L5.99996 11H18L17 13Z"
                    fill="currentColor"
                />
            </svg>
        )
    }
}
