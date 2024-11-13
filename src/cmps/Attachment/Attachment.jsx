import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function Attachment({ attachment }) {
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
                    <div className="btn btn-light btn-attachment-action">
                        <a href={attachment.url} target="_blank">  <img src="/img/icons/icon-export.svg" /></a>
                    </div>

                    <div className="btn btn-light btn-attachment-action">
                        <img src="/img/board-details/menu-dots.svg" />
                    </div>
                </div>
            </div>
        </div>
    )
}