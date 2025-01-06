import React from "react"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ManageReviews from "./ManageReviews";

const Review = async () => {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username, subscription_status")
    .eq("email", authData?.user?.email)
    .single();

  if (!(userData?.subscription_status === "pro"))
    return redirect("/dashboard");

  return (
    <div className='px-10 pt-10'>
      <ManageReviews username={userData.username}/>
    </div>
  )
}

export default Review