
import ClickOutside from '../cmps/ClickOutside.jsx'

export function MemberPreview({ member, handleCloseModal, onRemoveMember }) {
    return (

        // <ClickOutside onClick={handleCloseModal}>
        <div className="modal-member-preview" onClick={(ev) => ev.stopPropagation()}>
            <div className="option-modal-header member-preview-header">
                <i className="btn btn-close-member-preview fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="member-details">
                <div className="member-preview-photo">
                    <img src={member.imgUrl} />
                </div>
                <div className="details">
                    <span>{member.fullname}</span>
                    <span>{`@u${member._id.substring(18, 24)}`}</span>
                </div>
            </div>
            <hr />
            <button className="btn" onClick={() => onRemoveMember(member._id)}>Remove from card</button>
        </div>
        // </ClickOutside>
    )
}