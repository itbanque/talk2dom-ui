"use client"

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
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
      toast.success("Sent verification email");
      setResendStatus("sent");
    } catch (e) {
      setResendStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full">
        <h1 className="text-xl font-semibold mb-4">Verify Your Email</h1>
        <p className="text-gray-700 mb-6">
          We've sent a verification link to your email address. Please check your inbox
          and click the link to activate your account.
        </p>
        <p className="text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or contact support for help.
        </p>
        {!user?.is_active && (
          <div className="mt-4">
            <button
              onClick={resendVerificationEmail}
              disabled={resendStatus === "sending" || resendStatus === "sent"}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
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
          <a href="/" className="text-sm text-gray-600 hover:text-blue-600 underline">
            Return to homepage
          </a>
        </div>
      </div>
    </div>
  );
}
