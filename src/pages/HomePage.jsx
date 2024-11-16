import { useState } from 'react'
import { Link } from 'react-router-dom'
/* const carusalClass = [
    ['', 'right', 'right-edge'],
    ['left', '', 'right'],
    ['left-edge', 'left', ''],
] */
const carusalClass = ['', 'left', 'left-edge']
export function HomePage() {
    const [activeBtn, setActiveBtn] = useState(0)

    return (
        <section className="homepage full main-container">
            <div className="homepage-content1  main-container full ">
                <div className="content1-main">
                    <div className="text">
                        <h1>Yeyllo brings all your tasks, teammates, and tools together</h1>
                        <p>Keep everything in the same place—even if your team isn’t.</p>
                        <Link to="/workspace/home" className="start-demo-btn">
                            Start Demo
                        </Link>
                    </div>
                    <div>
                        <img src="/img/homepage/trello-hero.webp" alt="" />
                    </div>
                </div>
            </div>
            <div className="homepage-content2 main-container full">
                <header>
                    <p className="p1">Yeyllo 101</p>
                    <h2>A productivity powerhouse</h2>
                    <article>
                        <p className="p2">
                            Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a clear view of who’s doing what and what
                            needs to get done.
                        </p>
                    </article>
                </header>
                <section className="content2-main">
                    <nav className="carusal-nav">
                        <button className={activeBtn === 0 && 'active'} onClick={() => setActiveBtn(0)}>
                            <h3>Boards</h3>
                            <p>
                                Trello boards keep tasks organized and work moving forward. In a glance, see everything from “things to do” to “aww
                                yeah, we did it!”
                            </p>
                        </button>

                        <button className={activeBtn === 1 && 'active'} onClick={() => setActiveBtn(1)}>
                            <h3>lists</h3>
                            <p>
                                The different stages of a task. Start as simple as To Do, Doing or Done—or build a workflow custom fit to your team’s
                                needs. There’s no wrong way to Trello.
                            </p>
                        </button>

                        <button className={activeBtn === 2 && 'active'} onClick={() => setActiveBtn(2)}>
                            <h3>cards</h3>
                            <p>
                                Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards
                                across lists to show their status.
                            </p>
                        </button>
                    </nav>

                    <div className="picture-container">
                        <img src="/img/homepage/carusal_boards.webp" alt="" className={carusalClass[activeBtn]} />
                        <img src="/img/homepage/carusal_lists.webp" alt="" className={carusalClass[activeBtn]} />
                        <img src="/img/homepage/carusal_cards.webp" alt="" className={carusalClass[activeBtn]} />
                    </div>
                </section>
            </div>

            <footer className="full main-container">
                <section className="footer1 full main-container">
                    <div className="footer1-main">
                        <h2>Get started with Yeyllo today</h2>
                        <div className="footer-sign-up">
                            <input type="text" />
                            <button>Sign up - it’s free!</button>
                        </div>
                    </div>
                </section>
                <section className="footer2 full"></section>
            </footer>
        </section>
    )
}
