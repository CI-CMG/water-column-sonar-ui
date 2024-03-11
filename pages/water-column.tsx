// https://nextjs.org/docs/app/api-reference/file-conventions/page
import Link from 'next/link'

export default function WaterColumn({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div>
      <h1>Water Column View</h1>
      <Link href="/">Home</Link>
    </div>
  )
}