"use client"

declare global {
  interface Window {
    dataLayer?: {
      push: (event: Record<string, any>) => void;
    };
  }
}
export {};

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { DOMAIN } from "@/lib/constants";
import { toast } from "react-hot-toast";


export default function VerifyEmailPage() {
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { user } = useUser();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  useEffect(() => {
    if (user !== undefined) {
      setIsLoadingUser(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      window.dataLayer?.push({
        event: "page_view",
        page_name: "verify_email_page",
      });
    }
  }, [user]);
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6 md:py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const resendVerificationEmail = async () => {
    setResendStatus("sending");
    try {
      const response = await fetch(`${DOMAIN}/api/v1/user/resend-verify-email`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to resend verification email");
      window.dataLayer?.push({
        event: "resend_verification_email",
      });
      toast.success("Sent verification email");
      setResendStatus("sent");
    } catch (e) {
      setResendStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6 md:py-12">
      <div className="bg-white p-6 md:p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-lg md:text-xl font-semibold mb-4 text-center">Verify Your Email</h1>
        <p className="text-gray-700 mb-6 text-base md:text-lg leading-relaxed">
          We've sent a verification link to your email address. Please check your inbox
          and click the link to activate your account.
        </p>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed">
          Didn't receive the email? Check your spam folder or contact support for help.
        </p>
        {!user?.is_active && (
          <div className="mt-4">
            <button
              onClick={resendVerificationEmail}
              disabled={resendStatus === "sending" || resendStatus === "sent"}
              className="w-full md:w-auto text-sm md:text-base text-blue-600 hover:underline disabled:opacity-50 mt-2 md:mt-0"
            >
              {resendStatus === "sending"
                ? "Sending..."
                : resendStatus === "sent"
                ? "Verification email sent!"
                : "Resend verification email"}
            </button>
            {resendStatus === "error" && (
              <p className="text-red-500 text-sm mt-1">Failed to resend. Please try again.</p>
            )}
          </div>
        )}
        <div className="mt-6 text-center">
          <a href="/" className="inline-block w-full md:w-auto text-center text-sm md:text-base text-gray-600 hover:text-blue-600 underline py-2">
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
