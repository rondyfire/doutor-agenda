import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries()),
    );

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("Missing Stripe environment variables");
      throw new Error("Stripe secret key not found");
    }
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      console.error("No Stripe signature found");
      throw new Error("Stripe signature not found");
    }
    const text = await request.text();
    console.log("Webhook body received, length:", text.length);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Webhook event received:", event.type);
    console.log("Event data:", JSON.stringify(event.data, null, 2));

    switch (event.type) {
      case "ping":
        console.log("Stripe webhook ping received");
        break;
      case "checkout.session.completed": {
        console.log("Processing checkout.session.completed event");
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );

          console.log("Subscription retrieved:", subscription.id);
          console.log("Subscription metadata:", subscription.metadata);

          const userId = subscription.metadata.userId;

          if (!userId) {
            console.error("No userId found in subscription metadata");
            throw new Error("User ID not found");
          }

          console.log("Updating user:", userId, "with plan: essential");

          await db
            .update(usersTable)
            .set({
              stripeSubscriptionId: subscription.id,
              stripeCustomerId: subscription.customer as string,
              plan: "essential",
            })
            .where(eq(usersTable.id, userId));

          console.log("User updated successfully");
        }
        break;
      }
      case "invoice.paid": {
        console.log("Processing invoice.paid event");
        const invoice = event.data.object as Stripe.Invoice;
        if (!invoice.subscription) {
          console.error("No subscription found in invoice");
          throw new Error("Subscription ID not found");
        }

        // Buscar a subscription para obter os metadados
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string,
        );

        console.log("Subscription retrieved:", subscription.id);
        console.log("Subscription metadata:", subscription.metadata);

        const customer = invoice.customer as string;
        const userId = subscription.metadata.userId;

        if (!userId) {
          console.error("No userId found in subscription metadata");
          throw new Error("User ID not found");
        }

        console.log("Updating user:", userId, "with plan: essential");

        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customer,
            plan: "essential",
          })
          .where(eq(usersTable.id, userId));

        console.log("User updated successfully");
        break;
      }
      case "customer.subscription.deleted": {
        console.log("Processing customer.subscription.deleted event");
        if (!event.data.object.id) {
          throw new Error("Subscription ID not found");
        }
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        if (!subscription) {
          throw new Error("Subscription not found");
        }
        const userId = subscription.metadata.userId;
        if (!userId) {
          throw new Error("User ID not found");
        }
        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: null,
          })
          .where(eq(usersTable.id, userId));
        console.log("User subscription deleted successfully");
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
};
