"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import SignIn from "@/app/(auth)/sign-in/_components/sign-in";
import { authClient } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    authClient.oneTap({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || "An error occurred");
        },
        onSuccess: () => {
          toast.success("Successfully signed in");
          router.push(getCallbackURL(params));
        },
      },
    });
  }, []);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignIn />
      </div>
    </div>
  );
}
