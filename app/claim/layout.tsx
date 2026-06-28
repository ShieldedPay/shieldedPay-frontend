import { Toaster } from "@/components/ui/sonner"

export default function ClaimLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  )
}
