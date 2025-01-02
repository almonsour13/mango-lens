"use client"
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">
            404 - Page Not Found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We are sorry, the page you requested could not be found.
            Please check the URL or try navigating back to our homepage.
          </p>
        </div>
        <div className="mt-8">
          <Button
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={router.back}
          >
            <ArrowLeft className="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
            Return
          </Button>
        </div>
      </div>
    </div>
  )
}