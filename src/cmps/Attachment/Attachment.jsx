import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AttachmentActions } from '../Attachment/AttachmentActions.jsx'

dayjs.extend(relativeTime)

export function Attachment({ attachment, handleToggleModal, handleCloseModal, handleOpenModal, openModal, setTask, task }) {
    return (
        <div className="attachment-data">
            <a href={attachment.url}
                className="attachment-thumbnail"
                target="_blank"
                style={{
                    backgroundImage: `url(${attachment.url})`,
                    backgroundColor: attachment.bgColor || 'rgb(154, 139, 127)',
                    display: 'block',
                    width: '70px',
                    height: '50px',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}>
            </a>

            <div className="attachment-main">
                <div className="attachment-details">
                    <h2>{attachment.fileName}</h2>
                    <div className="attach-time-and-cover">
                        <p>Added {dayjs(attachment.uploadedAt).fromNow()}</p>
                        {attachment.isCover &&
                            <>
                                <p>•</p>
                                <div className="is-cover">
                                    <svg width="24" height="24" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5 5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5ZM19 7H5V13H19V7Z" fill="#44546f" />
                                    </svg>
                                    <p>Cover</p>
                                </div>
                            </>}
                    </div>
                </div>

                <div className="attachment-actions">
                    <div className="btn btn-clear btn-attachment-action">
                        <a href={attachment.url} target="_blank">  <img src="/img/icons/icon-export.svg" /></a>
                    </div>

                    <div className="more-actions-area">
                        <div className="btn btn-light btn-attachment-action" onClick={() => handleToggleModal(`attachment-${attachment.id}`)}>
                            <img src="/img/board-details/menu-dots.svg" />
                        </div>
                        {openModal === `attachment-${attachment.id}` &&
                            <AttachmentActions
                                attachment={attachment}
                                setTask={setTask}
                                task={task}
                                openModal={openModal}
                                handleCloseModal={handleCloseModal}
                                handleOpenModal={handleOpenModal} />}
                    </div>
                </div>
            </div>
        </div>
    )
}