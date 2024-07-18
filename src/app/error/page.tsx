import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Error</h1>
        <p className="mt-4">An error occurred while processing your request.</p>
        <Link href="/" className="mt-4 underline underline-offset-4">
          Go back.
        </Link>
      </div>
    </div>
  );
}
