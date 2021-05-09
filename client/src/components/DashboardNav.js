import React from 'react'
import { Link } from 'react-router-dom';


const DashboardNav = () => {
    const active=window.location.pathname;
    return (
        <>
            <ul className="nav-tabs nav ">
                <li className="nav-item">
                    <Link className={`nav-link ${active==="/dashboard" && "active"}`} to="/dashboard"><span>Your Bookings</span></Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${active==="/dashboard/seller" && "active"}`} to="/dashboard/seller"><span>Your Hotels</span></Link>
                </li>
            </ul>
        </>
    )
}

export default DashboardNav