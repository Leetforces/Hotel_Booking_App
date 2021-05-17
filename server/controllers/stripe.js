import User from "../models/user";
import Stripe from "stripe";
import queryString from "query-string";
import Hotel from "../models/hotel";
import Order from '../models/order'
import user from "../models/user";

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
  //Find user from db
  console.log("Something Something");
  const user = await User.findById(req.user._id).exec();

  //if user don't have stripe_account_id
  // !user.stripe_account_id
  if (true) {
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

  console.log("USER ========>", user);
  //create login link based on account id (for frontend to complete onboarding)
  let accountLink = await stripe.accountLinks.create({
    account: user.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });

  // prefill any info such as email
  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": user.email || undefined,
  });
  console.log("Account Link", accountLink);
  let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
  console.log("Link send to Frontend=====>", link);
  return res.send(link);
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

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });
    console.log("Balance=======>", balance);
    return res.json(balance);
  } catch (err) {
    console.log(err);
    return err;
  }
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

export const stripeSuccess = async(req,res) => {
  try{
    const {hotelId} = req.body

    const user = await user.findById(req.user._id).exec()

    if(!user.stripeSession) return;
    const session = await stripe.checkout.sessions.retrieve(user.stripeSession.id);

    if(session.payment_status === 'paid') {
      const orderExist =await Order.findOne({"session.id": session.id }).exec();
      if(orderExist) {
        res.json({ success: true});
      } else {
        let newOrder = await new Order({
          hotel: hotelId,
          session,
          orderedBy: user._id,
        }).save();
        //
        await User.findByIdAndUpdate(user._id, {
          $set: {stripeSession: {}},
        });

        res.json({ success: true});
      }
    }
  } catch (err) {
    console.log("STRIPE SUCCESS ERR",err);
  }
};