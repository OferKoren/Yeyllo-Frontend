
export function Attachment({ attachment }) {
    return (
        <a href={attachment.url}
            className="attachment-thumbnail"
            style={{
                backgroundImage: `url(${attachment.url})`,
                backgroundColor: 'rgb(154, 139, 127)',
                display: 'block',
                width: '100px',
                height: '100px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
        </a>
    )
}