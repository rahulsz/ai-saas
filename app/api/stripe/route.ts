import { auth , currentUser } from "@clerk/nextjs"

import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"
import { stripe } from "@/lib/stripe"
import { absoluteUrl } from "@/lib/utils"
import { metadata } from "@/app/layout"

const SettingsUrl  = absoluteUrl("/settings");

export async function GET(){
    try {
        const { userId } = auth();
        const user = await currentUser();

        if(!userId || !user){
           return new NextResponse("Unauthorized" , { status: 401});
        }

        const userSubcription = await prismadb.userSubscription.findUnique({
            where : {
                userId
            }
        })

        if ( userSubcription && userSubcription.stripeCustomerId){
            const striperSessions = await stripe.billingPortal.sessions.create({
                customer : userSubcription.stripeCustomerId,
                return_url : SettingsUrl,
            });

            return new NextResponse(JSON.stringify({ url : striperSessions.url}));
        }

        const striperSession = await stripe.checkout.sessions.create({
            success_url : SettingsUrl,
            cancel_url : SettingsUrl,
            payment_method_types : ["card"],
            mode : "subscription",
            billing_address_collection : "auto",
            customer_email : user.emailAddresses[0].emailAddress,
            line_items : [
                {
                    price_data :{
                       currency : "INR",
                       product_data : {
                        name : "Genius Pro",
                        description : "Unlimited AI Generations",
                       },
                       unit_amount : 20000,
                       recurring :{
                        interval : "month"
                       }
                    },
                    quantity : 1
                }
            ],
            metadata : {
                userId
            },
        })
         return new NextResponse(JSON.stringify({ url : striperSession.url}));
    }catch(error){
      console.log("[STRIPE_ERROR]", error);
      return new NextResponse("Internal Error", { status: 500});
    }
}