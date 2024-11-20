import { useState, useEffect } from 'react'
import { setFilterBy } from '../../store/actions/board.actions'
import { useSelector } from 'react-redux'

export function BoardFilter({ filterBy, board }) {
    const [filterToEdit, setFilterToEdit] = useState({ ...filterBy })
    const user = useSelector((storeState) => storeState.userModule.user)
    useEffect(() => {
        // console.log(filterToEdit)
        setFilterBy(filterToEdit)
    }, [filterToEdit])

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let fieldset = ''
        let value = ev.target.value

        switch (type) {
            case 'text':
            case 'radio':
                break
            case 'number':
                value = +ev.target.value || ''
                break
            case 'checkbox': {
                fieldset = ev.target.closest('fieldset')
                console.log(fieldset.name)
            }
        }
        if (fieldset) {
            if (fieldset.name === 'filterBy-members') {
                console.log('hehre')
                let membersToUpdate = [...filterToEdit.members]
                if (ev.target.checked) {
                    membersToUpdate.push(value)
                } else {
                    membersToUpdate = membersToUpdate.filter((member) => member !== value)
                }

                setFilterToEdit((prevfilter) => ({ ...prevfilter, members: membersToUpdate }))
            }
        } else setFilterToEdit((prevfilter) => ({ ...prevfilter, [field]: value }))
    }
    if (!filterBy || !board) return

    const { keyword } = filterToEdit
    return (
        <section className="board-filter">
            <div className="title">Keyword</div>
            <input type="text" name="keyword" className="input" value={keyword} onChange={handleChange} placeholder="Enter a keyword..." />
            <p className="info">Search cards, labels, and more.</p>

            <div className="title">Members</div>
            <fieldset name="filterBy-members">
                <div className="member-filter-item">
                    <input
                        type="checkbox"
                        id={'no-members'}
                        className="hid"
                        onChange={handleChange}
                        checked={filterBy.members.some((member1) => member1 === 'no-member')}
                        value={'no-member'}
                    />
                    <label htmlFor={'no-members'} className="no-member-label">
                        <div className="no-member-wrap">
                            <NoMembers />
                        </div>
                        No members
                    </label>
                </div>

                {user && user.fullname !== 'Guest' && (
                    <div key={user._id} className="member-filter-item">
                        <input
                            type="checkbox"
                            id={user._id}
                            className="hid"
                            onChange={handleChange}
                            checked={filterBy.members.some((member1) => member1 === user._id)}
                            value={user._id}
                        />
                        <label htmlFor={user._id}>
                            <img className="member-img" src={user.imgUrl} alt="" />
                            Cards assigned to me
                        </label>
                    </div>
                )}

                {board.members &&
                    board.members.map((member) => {
                        if (user.fullname === member.fullname) return
                        return (
                            <div key={member._id} className="member-filter-item">
                                <input
                                    type="checkbox"
                                    id={member._id}
                                    className="hid"
                                    onChange={handleChange}
                                    checked={filterBy.members.some((member1) => member1 === member._id)}
                                    value={member._id}
                                />
                                <label htmlFor={member._id}>
                                    {/* {filterBy.members.some((member1) => member1 === member._id) ? <FullCheckbox /> : <EmptyCheckbox />} */}
                                    <img className="member-img" src={member.imgUrl} alt="" />
                                    {member.fullname}
                                </label>
                            </div>
                        )
                    })}
            </fieldset>
        </section>
    )

    function FullCheckbox() {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="-3 -4 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="presentation"
            >
                <path d="M1.49022 3.21486C1.2407 2.94412 0.818938 2.92692 0.548195 3.17644C0.277453 3.42597 0.260252 3.84773 0.509776 4.11847L2.91785 6.73131C3.2762 7.08204 3.80964 7.08204 4.14076 6.75092C4.18159 6.71082 4.18159 6.71082 4.38359 6.51218C4.57995 6.31903 4.79875 6.1037 5.03438 5.87167C5.70762 5.20868 6.38087 4.54459 7.00931 3.92318L7.0362 3.89659C8.15272 2.79246 9.00025 1.9491 9.47463 1.46815C9.73318 1.20602 9.73029 0.783922 9.46815 0.525367C9.20602 0.266812 8.78392 0.269712 8.52537 0.531843C8.05616 1.00754 7.21125 1.84829 6.09866 2.94854L6.07182 2.97508C5.4441 3.59578 4.77147 4.25926 4.09883 4.92165C3.90522 5.11231 3.72299 5.29168 3.55525 5.4567L1.49022 3.21486Z"></path>
            </svg>
        )
    }

    function EmptyCheckbox() {
        return (
            <svg
                width="16px"
                height="16px"
                viewBox="-3 -4 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="presentation"
            >
                <path d="M1.49022 3.21486C1.2407 2.94412 0.818938 2.92692 0.548195 3.17644C0.277453 3.42597 0.260252 3.84773 0.509776 4.11847L2.91785 6.73131C3.2762 7.08204 3.80964 7.08204 4.14076 6.75092C4.18159 6.71082 4.18159 6.71082 4.38359 6.51218C4.57995 6.31903 4.79875 6.1037 5.03438 5.87167C5.70762 5.20868 6.38087 4.54459 7.00931 3.92318L7.0362 3.89659C8.15272 2.79246 9.00025 1.9491 9.47463 1.46815C9.73318 1.20602 9.73029 0.783922 9.46815 0.525367C9.20602 0.266812 8.78392 0.269712 8.52537 0.531843C8.05616 1.00754 7.21125 1.84829 6.09866 2.94854L6.07182 2.97508C5.4441 3.59578 4.77147 4.25926 4.09883 4.92165C3.90522 5.11231 3.72299 5.29168 3.55525 5.4567L1.49022 3.21486Z"></path>
            </svg>
        )
    }

    function NoMembers() {
        return (
            <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0254 3C9.25613 3 7.01123 5.23858 7.01123 8C7.01123 10.7614 9.25613 13 12.0254 13C14.7946 13 17.0395 10.7614 17.0395 8C17.0395 5.23858 14.7946 3 12.0254 3ZM9.01688 8C9.01688 9.65685 10.3638 11 12.0254 11C13.6869 11 15.0338 9.65685 15.0338 8C15.0338 6.34315 13.6869 5 12.0254 5C10.3638 5 9.01688 6.34315 9.01688 8Z"
                    fill="currentColor"
                ></path>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.0254 11C16.7803 11 20.6765 14.6667 21.0254 19.3194C20.8721 20.2721 20.0439 21 19.0452 21H18.9741C18.9741 21 18.9741 21 18.9741 21L5.0767 21C5.07671 21 5.0767 21 5.0767 21L5.00562 21C4.00691 21 3.1787 20.2721 3.02539 19.3193C3.37428 14.6667 7.27038 11 12.0254 11ZM5.0767 19H18.9741C18.4875 15.6077 15.5618 13 12.0254 13C8.48892 13 5.56331 15.6077 5.0767 19ZM19.0451 19.9769V20.0231C19.0452 20.0154 19.0452 20.0077 19.0452 20C19.0452 19.9923 19.0452 19.9846 19.0451 19.9769Z"
                    fill="currentColor"
                ></path>
            </svg>
        )
    }
}
