import React from 'react'
import { useSelector } from 'react-redux';
import { Card, Avatar } from 'antd';
import moment from 'moment';
const { Meta } = Card;

const ConnectNav = () => {
    const auth = useSelector((state) => {
        return ({
            ...state.auth
        })
    });
    const { user } = auth;
    console.log("auth", auth);
    return (
        <>
            <div className="d-flex justify-content-around">
                <Card>
                    <Meta avatar={<Avatar>{user.name[0]}</Avatar>} title={user.name} description={`Joined ${moment(user.createdAt).fromNow()}`}/>
                </Card>

                {auth && user && user.stripe_seller && user.stripe_seller.charges_enabled && (<>
                    <div>Pending Balance</div>
                    <div>Payout Settings</div>
                </>)}
            </div>
        </>
    );
}

export default ConnectNav;
