import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import './Topbar.css'

function Topbar() {
    return (
        <div className="top">
            <div className="topLeft">
                <a href="https://slack.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-slack"></i></a>
                <a href="https://www.linkedin.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-linkedin"></i></a>
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem"><Link className="Link" to="/">HOME</Link></li>
                </ul>
            </div>
            <div className="topRight">
                <a href="https://www.hackerrank.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-hackerrank"></i></a>
                <a href="https://github.com/" className="topIcon" target="_blank" rel='noreferrer noopener'><i className="fab fa-github"></i></a>
            </div>
        </div>
    );
}

export default Topbar;