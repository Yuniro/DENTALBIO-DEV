import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import PricingTable from "./PricingTable";
import Image from "next/image";
import Link from "next/link";
import SignOutForm from "./SignOutForm"; // Import the SignOutForm component
import SendEmailConfirmation from "./SendEmailConfirmation"; // Import the client-side component
import { revalidatePath } from "next/cache";
import { User } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import GotoDashboard from "../components/Button/GotoDashboard";

export default async function DashboardPage() {
  const supabase = createClient();

  // const handleManageSubscription = async () => {
  //   "use server"
  //   const response = await fetch('/api/create-portal-session', {
  //     method: 'POST'
  //   })
  // }

  // Fetch the authenticated user
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    redirect("/login");
  }

  const email = userData.user.email ?? "";
  const { username, first_name, last_name, title, country, position } =
    userData.user.user_metadata;

  // Fetch the user's data including subscription status and username
  const { data: userRecord, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status, first_name, role")
    .eq("email", email)
    .single();

  if (userError && userError.code !== "PGRST116") {
    return redirect("/error");
  }

  if (!userRecord) {
    return redirect("/error");
  }

  const subscriptionStatus = userRecord?.subscription_status;

  // **Key Logic**: Show the pricing table for users who are **not** subscribed
  if (subscriptionStatus !== "active" && subscriptionStatus !== "trialing") {
    return (
      <>
        <div className="px-3 py-3 h-screen w-full flex flex-col items-center justify-between">
          <div className="flex flex-col items-start w-full justify-center">
            <div className="w-full flex justify-end items-center px-3">
              <SignOutForm /> {/* Use the client-side sign-out component */}
            </div>
            {userRecord.role === "admin" && (
              <div className="w-full flex justify-end items-center px-3">
                <Link
                  href="/admin"
                  className="flex no-underline items-center gap-2 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  <User size={20} weight="bold" />
                  Admin Panel
                </Link>
              </div>
            )}
            <div className="max-w-screen-2xl w-full mt-5 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-primary-orange-1 pb-6">
                Welcome, {first_name}!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
                dental.bio/{userRecord.username} is yours!
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
                You have upgraded your plan successfully!
                {/* <span className="font-medium">is yours!</span> */}
              </span>
              <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
                Invite your friend to get one month free!
                {/* <span className="font-medium">is yours!</span> */}
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark pb-4">
                No payments until after our official launch!
              </span>
              <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark">
                Exclusive pre-launch offer, don't miss out!
              </span>
              <div className="my-6">
                <GotoDashboard />
              </div>
            </div>
          </div>
          <Link href={"/"}>
            <Image
              src="/logo.svg"
              width={150}
              height={40}
              alt="Footer logo"
              className="mb-10 mt-20"
            />
          </Link>
        </div>
      </>
    );
  }

  // For subscribed users, show the dashboard with the Manage Subscription button
  return (
    <>
      <div className="px-3 py-3 h-screen flex flex-col items-center justify-between">
        <div className="flex flex-col items-start justify-center">
          <div className="w-full flex justify-end items-center px-3">
            <SignOutForm /> {/* Use the client-side sign-out component */}
          </div>
          {userRecord.role === "admin" && (
            <div className="w-full flex justify-end items-center px-3">
              <Link
                href="/admin"
                className="flex no-underline items-center gap-2 hover:bg-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium transition-all"
              >
                <User size={20} weight="bold" />
                Admin Panel
              </Link>
            </div>
          )}
          <div className="max-w-screen-2xl w-full mt-5 text-center flex flex-col items-center justify-center px-5 lg:px-32 mx-auto">
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-primary-orange-1 pb-6">
              Welcome, {first_name}!
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-10">
              dental.bio/{userRecord.username} is yours!
            </span>
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold lg:leading-snug bg-gradient-to-r from-primary-1 via-primary-2 to-primary-orange-1 bg-clip-text text-transparent pb-4">
              You have upgraded your plan successfully!
              {/* <span className="font-medium">is yours!</span> */}
            </span>
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark pb-2">
              No payments until after our official launch!
            </span>
            <span className="text-xl md:text-2xl lg:text-3xl font-semibold leading-snug text-dark">
              Exclusive pre-launch offer, don't miss out!
            </span>
          </div>
        </div>
        <Link href={"/"}>
          <Image
            src="/logo.svg"
            width={150}
            height={40}
            alt="Footer logo"
            className="mb-10 mt-20"
          />
        </Link>
      </div>
    </>
  );
}
