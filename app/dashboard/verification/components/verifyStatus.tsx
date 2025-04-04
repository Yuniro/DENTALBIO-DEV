'use client'

import Loading from "@/app/dashboard/loading";
import { useEffect, useState } from "react";
import VerifyButton from "./VerifyButton";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SealCheck } from "@phosphor-icons/react";
import { redirect, useSearchParams } from "next/navigation";
import { usePreview } from "@/app/contexts/PreviewContext";
import { isWithinSevenDays } from "@/utils/functions/isWithinSevenDays";
import { sendVerificationMail } from "@/utils/mails/sendVerificationMail";
// import { useAdmin } from "@/utils/functions/useAdmin";

type SessionType = "pending" | "approved" | "declined" | "not_started";

type VerifyStatusProps = {
  enabled: boolean;
}

const VerifyStatus: React.FC<VerifyStatusProps> = ({ enabled }) => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [sessionStatus, setSessionStatus] = useState<SessionType | null>(null);
  const { triggerReload } = usePreview();
  const searchParams = useSearchParams();
  const targetUserId = searchParams.get('userId')
  // const { getTargetUserId } = useAdmin();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify({ targetUserId })
      });
      const data = await response.json();

      if (!data) {
        return redirect("/error?message=user_not_found");
      }

      if (data.isVerified) {
        setSessionStatus("approved");
      } else if (data.session_id) {
        if (isWithinSevenDays(new Date(data.session_created_at))) {
          const response = await fetch(`/api/veriff/session-status?sessionId=${data.session_id}`);
          const { status } = await response.json();
          if (status === "approved") {
            await sendVerificationMail(data.email!, data.username!, data.first_name!);

            triggerReload();
          }
          setSessionStatus(status);
        } else {
          setSessionStatus("declined");
        }
      } else {
        setSessionStatus("not_started");
      }

      setUserData(data);
    }

    fetchUserData();
  }, [])

  if (!userData)
    return <Loading />

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="mb-0">{userData.isVerified ? "Your account is verified" : "Identity verification"}</h4>
        {(sessionStatus === "approved") && <SealCheck size={16} weight="fill" color="#49ADF4" />}
      </div>

      {(sessionStatus === "approved") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-gray-500">You verified your identity</h3>
            <p className="text-gray-500">You've completed an important part of establishing trust in our community.</p>
            <div className="text-gray-500">

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <CheckCircle size={36} weight="fill" color="#5046db" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-4">
                  <h6 className="text-gray-500 mb-1">Connect your phone</h6>
                  <p className="font-light text-gray-500">Use your phone to access the verification flow.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <CheckCircle size={36} weight="fill" color="#5046db" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-4">
                  <h6 className="text-gray-500 mb-1">Show us a ID card photo</h6>
                  <p className="font-light text-gray-500">We'll check that your ID card's authenticity.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <CheckCircle size={36} weight="fill" color="#5046db" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-4">
                  <h6 className="text-gray-500 mb-1">Appear on camera</h6>
                  <p className="font-light text-gray-500">To show us it's really you, take a selfie.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <CheckCircle size={36} weight="fill" color="#5046db" />
                <div className="mt-1">
                  <h6 className="text-gray-500 mb-1">Liveness Detection</h6>
                  <p className="font-light text-gray-500">Follow the instructions to ensure you're completing this in real-time.</p>
                </div>
              </div>
            </div>
          </div>
        </>}

      {(sessionStatus === "pending") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-gray-500 mb-3">Verification in Progress</h3>
            <p className="text-gray-500 mb-1">Thank you for submitting your verification details.</p>
            <p className="text-gray-500 mb-1">Our team is currently reviewing your information to ensure everything meets the required standards.</p>
            <p className="text-gray-500 mb-1">You will receive a notification via email as soon as the verification process is completed. If additional information is needed, we will reach out to you directly.</p>
            <p className="text-gray-500 mb-1">We appreciate your patience and understanding during this process.</p>
          </div>
        </>}

      {(sessionStatus === "declined") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-gray-500">Verification failed</h3>
            <p className="text-gray-500">Please try again:</p>
            <div className="text-gray-500">

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-2">
                  <h6 className="text-gray-500  mb-1">Connect via your phone</h6>
                  <p className="font-light text-gray-500">You will need to connect to Veriff via your phone.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-2">
                  <h6 className="text-gray-500 mb-1">Upload Your ID Card</h6>
                  <p className="font-light text-gray-500">You will be prompted to upload a clear picture of your ID card.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1">
                  <h6 className="text-gray-500 mb-1">Take a Selfie</h6>
                  <p className="font-light text-gray-500">After uploading your ID, you’ll need to take a selfie. This selfie will be compared to the photo on your ID to confirm that it’s really you.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-8 h-8 aspect-square rounded-full border"></div>
                <div className="mt-1">
                  <h6 className="text-gray-500 mb-1">Perform Liveness Detection</h6>
                  <p className="font-light text-gray-500">Follow the instructions to ensure you're completing this in real-time.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <VerifyButton
              text="Try again"
              enabled={enabled}
            />
          </div>
        </>}

      {(sessionStatus === "not_started") &&
        <>
          <div className="p-6 bg-white rounded-[26px]">
            <h3 className="text-gray-500">You haven't verified your identity yet</h3>
            <p className="text-gray-500">How to verify your identity to keep the community safe for everyone:</p>
            <div className="text-gray-500">

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-2">
                  <h6 className="text-gray-500 mb-1">Connect via your phone</h6>
                  <p className="font-light text-gray-500">You will need to connect to Veriff via your phone.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1 mb-2">
                  <h6 className="text-gray-500 mb-1">Upload Your ID Card</h6>
                  <p className="font-light text-gray-500">You will be prompted to upload a clear picture of your ID card.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 aspect-square rounded-full border" />
                  <div className="w-0 border-r flex-grow" />
                </div>
                <div className="mt-1">
                  <h6 className="text-gray-500 mb-1">Take a Selfie</h6>
                  <p className="font-light text-gray-500">After uploading your ID, you’ll need to take a selfie. This selfie will be compared to the photo on your ID to confirm that it’s really you.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="w-8 h-8 aspect-square rounded-full border"></div>
                <div className="mt-1">
                  <h6 className="text-gray-500 mb-1">Perform Liveness Detection</h6>
                  <p className="font-light text-gray-500">Follow the instructions to ensure you're completing this in real-time.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <VerifyButton
              enabled={enabled}
            />
          </div>
        </>}

    </div>
  );
}

export default VerifyStatus;