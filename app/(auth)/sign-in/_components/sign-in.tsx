"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInForm } from "@/components/forms/sign-in-form";
import { SignUpForm } from "@/components/forms/sign-up-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldSeparator } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { getCallbackURL } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { LastUsedIndicator } from "@/components/last-used-indicator";

export default function SignIn() {
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-4xl mx-auto")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {view === "sign-in" ? (
                <motion.div
                  key="sign-in"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center mb-6">
                      <h1 className="text-2xl font-bold">Welcome back</h1>
                      <p className="text-muted-foreground text-balance">Login to your Shastho Tech account</p>
                    </div>

                    <SignInForm onSuccess={() => router.push(getCallbackURL(params))} callbackURL="/dashboard" />

                    <Field className="mt-4">
                      <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                        Or continue with
                      </FieldSeparator>
                    </Field>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        type="button"
                        className="relative w-full"
                        onClick={handleSignInWithGoogle}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Continue with Google</span>
                        {isMounted && authClient.isLastUsedLoginMethod("google") && <LastUsedIndicator />}
                      </Button>
                    </div>

                    <FieldDescription className="text-center mt-6">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setView("sign-up")}
                        className="underline underline-offset-4 hover:text-primary font-medium"
                      >
                        Sign up
                      </button>
                    </FieldDescription>
                  </FieldGroup>
                </motion.div>
              ) : (
                <motion.div
                  key="sign-up"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center mb-6">
                      <h1 className="text-2xl font-bold">Create an account</h1>
                      <p className="text-muted-foreground text-balance">
                        Enter your details below to create your account
                      </p>
                    </div>

                    <SignUpForm onSuccess={() => setView("sign-in")} callbackURL="/dashboard" />

                    <FieldDescription className="text-center mt-6">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setView("sign-in")}
                        className="underline underline-offset-4 hover:text-primary font-medium"
                      >
                        Login
                      </button>
                    </FieldDescription>
                  </FieldGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/doctor.png"
              alt="Sign in"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
