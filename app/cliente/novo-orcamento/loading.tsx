import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto">
      <Skeleton className="h-8 w-64 mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>

          <Skeleton className="h-10 w-full mb-6" />

          <div className="rounded-md border">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Skeleton className="h-[600px] w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
