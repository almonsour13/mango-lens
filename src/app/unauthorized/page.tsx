export default function Unauthorized() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">Unauthorized Access</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }