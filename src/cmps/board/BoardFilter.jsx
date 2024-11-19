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
            <p className="info">Search cards, members, labels, and more.</p>

            <div className="title">Members</div>
            <fieldset name="filterBy-members">
                {board.members &&
                    board.members.map((member) => {
                        console.log(member)
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
}
