
export function Attachment({ attachment }) {
    return (
        <a href={attachment.url}
            className="attachment-thumbnail"
            style={{
                backgroundImage: `url(${attachment.url})`,
                backgroundColor: attachment.bgColor || 'rgb(154, 139, 127)',
                display: 'block',
                width: '100px',
                height: '100px',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                // backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
        </a>
    )
}