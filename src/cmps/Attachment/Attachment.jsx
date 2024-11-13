import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AttachmentActions } from '../Attachment/AttachmentActions.jsx'

dayjs.extend(relativeTime)

export function Attachment({ attachment, handleToggleModal, openModal, setTask }) {
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
                    <p>Added {dayjs(attachment.uploadedAt).fromNow()}</p>
                </div>
                <div className="attachment-actions">
                    <div className="btn btn-clear btn-attachment-action">
                        <a href={attachment.url} target="_blank">  <img src="/img/icons/icon-export.svg" /></a>
                    </div>

                    <div className="more-actions-area">
                        <div className="btn btn-light btn-attachment-action" onClick={() => handleToggleModal(`attachment-${attachment.id}`)}>
                            <img src="/img/board-details/menu-dots.svg" />
                        </div>
                        {openModal === `attachment-${attachment.id}` && <AttachmentActions attachment={attachment} setTask={setTask} />}
                    </div>
                </div>
            </div>
        </div>
    )
}