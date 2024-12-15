import dayjs from 'dayjs'

export function Activity({ board }) {
    return (
        <section className="activity-menu">
            <ul style={{ display: 'grid', gap: '0.8em' }}>
                {board.activities?.length > 0 &&
                    board.activities.map((activity, i) => (
                        <li
                            key={i}
                            style={{
                                fontSize: '0.9rem',
                                display: 'grid',
                                gridTemplateColumns: '30px 1fr',
                                gap: '0.7em',
                                alignItems: 'start',
                            }}
                        >
                            <img src={activity.byMember.imgUrl} style={{ height: '30px', borderRadius: '50%' }}></img>
                            <div>
                                <span style={{ fontFamily: 'roboto-medium' }}>{activity.byMember.fullname}&nbsp;</span>
                                <span>{activity.txt}</span>
                                <div>{dayjs().diff(activity.createdAt, 'week') >= 1
                                    ? dayjs(activity.createdAt).format('MMM DD, YYYY [at] HH:mm')
                                    : dayjs(activity.createdAt).fromNow()
                                }</div>
                            </div>
                        </li>
                    ))}
            </ul>
        </section>
    )
}
