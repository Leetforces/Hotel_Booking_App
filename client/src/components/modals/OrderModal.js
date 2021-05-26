import React from 'react'
import {Modal} from 'antd';
import { currencyFormatter } from '../../actions/stripe';
const OrderModal = ({session,orderedBy,showModal,setShowModal}) => {
    return (
        <div>
            <Modal visible={showModal} title="Order Payment Info" onCancel={()=> setShowModal(!showModal)}>
               <p>Payment Intent: {session.payment_intent}</p>
               <p>Payment Status: {session.payment_status}</p>
               <p>Amount Total: {session.currency.toUpperCase()} {session.amount_total}</p>
                <p>Stripe Customer ID : {session.customer}</p>
                <p>Customer: {orderedBy.name}</p>
                <p></p>
            </Modal>
        </div>
    )
}

export default OrderModal;
