import UploadField from "@/components/common/scan/upload/upload-image";
import { AuthProvider } from "@/context/auth-context";

export default function Page(){
    return(
      <AuthProvider>
          <UploadField/>
      </AuthProvider>
  )
}