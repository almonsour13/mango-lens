"use client"
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";

export default function Page(){
    const { userInfo,resetToken } = useAuth();
    
  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
        window.location.href = "/signin";
        resetToken();
    }
};
  return(
      <>
      <PageWrapper>
        admin
        <Button onClick={handleLogout}>
          logout
        </Button>
      </PageWrapper>
      </>
  )
}