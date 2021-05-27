import User from "../models/user";
import Stripe from "stripe";
import queryString from "query-string";
import Hotel from "../models/hotel";
import Order from '../models/order'
import Account from '../models/account'
import { response } from "express";

const stripe = Stripe(process.env.STRIPE_SECRET);
const { v4: uuidv4 } = require('uuid');

export const createConnectAccount = async (req, res) => {
  //Find user from db
  console.log("Something Something");
  const user = await User.findById(req.user._id).exec();


  if (!user.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });
    user.stripe_account_id = account.id;
    user.save();
  }

  // console.log("USER ========>", user);
  // //create login link based on account id (for frontend to complete onboarding)
  // let accountLink = await stripe.accountLinks.create({
  //   account: user.stripe_account_id,
  //   refresh_url: process.env.STRIPE_REDIRECT_URL,
  //   return_url: process.env.STRIPE_REDIRECT_URL,
  //   type: "account_onboarding",
  // });

  // // prefill any info such as email
  // accountLink = Object.assign(accountLink, {
  //   "stripe_user[email]": user.email || undefined,
  // });
  // console.log("Account Link", accountLink);
  // let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
  // console.log("Link send to Frontend=====>", link);
  // return res.send(link);

  return res.send("Stripe Account_id created.");
};

const updateDelayDays = async (accountId) => {
  try {
    const account = await stripe.accounts.update(accountId, {
      settings: {
        payouts: {
          schedule: {
            delay_days: 7,
          },
        },
      },
    });
    console.log("=========>", account);
    return account;
  } catch (err) {
    console.log("Error in updating delay date", err);
    return err;
  }
};
export const getAccountStatus = async (req, res) => {
  //Find user from db
  const user = await User.findById(req.user._id).exec();
  const account = await stripe.accounts.retrieve(user.stripe_account_id);

  //update delays days 2(default) to 7days
  //    const updateAccount= await updateDelayDays(account.id);
  //    console.log("Updated Account",updateAccount);

  //update  in database
  const upadatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      stripe_seller: account,
    },
    { new: true }
  )
    .select("-password")
    .exec();

  console.log("Updated user======> ", upadatedUser);
  res.json(upadatedUser);
};


export const getAccountBalance = async (req, res) => {
  const user = await User.findById(req.user._id).exec();
  let balance = 0;

  const allBookedUserHotels = await Order.find({ postedBy: req.user._id });

  for (let i = 0; i < allBookedUserHotels.length; i++) {
    console.log(balance);
    balance += parseInt(allBookedUserHotels[i].session.amount_total);
  }
  return res.json({ balance: balance });
  // try {
  //   const balance = await stripe.balance.retrieve({
  //     stripeAccount: user.stripe_account_id,
  //   });
  //   console.log("Balance=======>", balance);
  //   return res.json(balance);
  // } catch (err) {
  //   console.log(err);
  //   return err;
  // }
};

export const payoutSetting = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_account_id,
      {
        redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL,
      }
    );
    console.log("Login Link For Payout Setting =====>", loginLink);
    return res.json(loginLink);
  } catch (err) {
    console.log("Stripe Payout Setting Error====>", err);
  }
};


export const stripeSessionId = async (req, res) => {
  // console.log("you hit stripe session id", req.body.hotelId);
  // 1) get hotel id from req.body
  const { hotelId } = req.body;
  // 2) find the hotel based on hotel in from db
  const item = await Hotel.findById(hotelId).populate("postedBy").exec();
  // 3) charge - 20% as application fee
  const fee = (item.price * 20) / 100;
  // 4) create a session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // 5) purchasing item details, it will be shown to user on checkout
    line_items: [
      {
        name: item.title,
        amount: item.price * 100, // in cents
        currency: "usd",
        quantity: 1,
      },
    ],
    // 6) Create payment intent with application fee and destination charge 80%

    payment_intent_data: {
      application_fee_amount: fee * 100,
      // this seller can see his balance in our frontend dashboard
      transfer_data: {
        destination: item.postedBy.stripe_account_id,
      },
    },
    // success and cancel urls
    success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });
  // 7) add this session object to user in the db
  await User.findByIdAndUpdate(req.user._id, { stripeSession: session }).exec();
  // 8) send session id as response to frontend
  res.send({
    sessionId: session.id,
  });
};

export const stripeSuccess = async (req, res) => {
  try {
    const { hotelId } = req.body

    const user = await user.findById(req.user._id).exec()

    if (!user.stripeSession) return;
    const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id);

    if (session.payment_status === 'paid') {
      const orderExist = await Order.findOne({ "session.id": session.id }).exec();
      if (orderExist) {
        res.json({ success: true });
      } else {
        let newOrder = await new Order({
          hotel: hotelId,
          session,
          orderedBy: user._id,
        }).save();
        //
        await User.findByIdAndUpdate(user._id, {
          $set: { stripeSession: {} },
        });

        res.json({ success: true });
      }
    }
  } catch (err) {
    console.log("STRIPE SUCCESS ERR", err);
  }
};



export const makePayment = async (req, res) => {

  const { data, price, hotelId } = req.body;
  const item = await Hotel.findById(hotelId).exec();
  const postedBy = item.postedBy;
  console.log("price===>", price);
  console.log("data===>", data);
  console.log("hotelId==>", hotelId);
  /*
    price===> undefined
data===> {
id: 'tok_1IvOZ7SCDAodenDBAZ0QxoJE',
object: 'token',
card: {
  id: 'card_1IvOZ7SCDAodenDBlzFawNJT',
  object: 'card',
  address_city: 'kolkata',
  address_country: 'India',
  address_line1: 'kolkata,india',
  address_line1_check: 'unchecked',
  address_line2: null,
  address_state: '28',
  address_zip: '700032',
  address_zip_check: 'unchecked',
  brand: 'Visa',
  country: 'US',
  cvc_check: 'unchecked',
  dynamic_last4: null,
  exp_month: 12,
  exp_year: 2045,
  funding: 'credit',
  last4: '4242',
  name: 'Manish Kumar',
  tokenization_method: null
},
client_ip: '49.37.19.66',
created: 1622042557,
email: 'manishraj880980@gmail.com',
livemode: false,
type: 'card',
used: false
}
hotelId==> 60a754ed0797e130442d6ab8
  */
  const session = {
    "id": data.id,
    "object": "checkout.session",
    "allow_promotion_codes": null,
    "amount_subtotal": price,
    "amount_total": price,
    "billing_address_collection": data.address_city,
    "cancel_url": "http://localhost:3000/stripe/cancel",
    "client_reference_id": null,
    "currency": "usd",
    "customer": data.card.id,
    "customer_details": {
      "email": data.email,
      "tax_exempt": "none",
      "tax_ids": []
    },
    "customer_email": data.email,
    "livemode": false,
    "locale": null,
    "mode": "payment",
    "payment_intent": data.id,
    "payment_method_types": [
      "card"
    ],
    "payment_status": "paid",
    "setup_intent": null,
    "shipping": null,
    "shipping_address_collection": null,
    "submit_type": null,
    "success_url": `http://localhost:3000/stripe/success/${hotelId}`,
    "total_details": {
      "amount_discount": 0,
      "amount_tax": 0,
    },


  }

  let newOrder = await new Order({
    hotel: hotelId,
    session,
    postedBy,
    orderedBy: req.user._id,
  }).save();

  res.send("Booking successful.");
  /*


  {
      hotel: {
          type: ObjectId,
          ref: "Hotel",
      },
      session: {},
      orderedBy: {type: ObjectId, ref: "user" },
  }
      email
      price
      id of customer
      product name
      card name
      card country
   
  */

};

export const activateAccount = async (req, res) => {

  try {

    const { holderName, accountNo, ifsc, password } = req.body;
    let user = await User.findById(req.user._id).exec();

    // comapre password
    user.comparePassword(password, (err, match) => {
      // if password doesn't match or returns an error
      if (!match || err) return res.status(400).send("Wrong Password");
      
      const userAccount = new Account({
        holderName,
        ifsc,
        accountNo,
        userId:user._id,
      });
       
      userAccount.save();

      const stripe_seller={
         "id": user.stripe_account_id,
         "charges_enabled":true,
         "email":user.email,
         "default_currency":"usd",
         "payouts_enabled":true,
      }

      user.stripe_seller=stripe_seller;
      user.save();

      return res.send("Account Activated Successfully:)");

    });

      
  } catch (err) {
    // if error, send the error message
    console.log("Login ERROR:", err);
    res.status(400).send("Activate Account Failed");
  }

}