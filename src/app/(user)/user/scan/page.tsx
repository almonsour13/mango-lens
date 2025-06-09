import UploadField from "@/components/common/scan/upload/upload-image";
import { AuthProvider } from "@/context/auth-context";
import { Suspense } from "react";

export default function Page(){
    return(
      <AuthProvider>
    <Suspense fallback={<div>loading</div>}>
          <UploadField/>
    </Suspense>
      </AuthProvider>
  )
}