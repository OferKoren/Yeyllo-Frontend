export function FirstBgMenu({ onEnterMenu }) {
    return (
        <div className="first-bg-menu">
            <button className="menu-bg-btn" onClick={() => onEnterMenu('second-bg-menu-photos')}>
                <div className="image-photo">
                    <div className="highlight"></div>
                </div>
                <div>Photos</div>
            </button>

            <button className="menu-bg-btn" onClick={() => onEnterMenu('second-bg-menu-colors')}>
                <div className="image-color">
                    <div className="highlight"></div>
                </div>
                <div>Colors</div>
            </button>
        </div>
    )
}
