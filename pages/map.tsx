// https://nextjs.org/docs/app/api-reference/file-conventions/page
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// export default function Map({
//   params,
//   searchParams,
// }: {
//   params: { slug: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }) {
//   // const ship_name = searchParams('ship_name')
//   return (
//     <div>
//       <h1>Map View</h1>
//       <Link href="/">Home</Link>
//     </div>
//   )
// }

// export default function Map() {
//   // const ship_name = searchParams('ship_name')
//   const searchParams = useSearchParams()
//   let ship_name = ''
 
//   if (searchParams !== null && searchParams?.has("ship_name")) {
//     ship_name = searchParams.get('ship_name')
//   }
 
//   return (
//     <div>
//       <h1>Map View {ship_name}</h1>
//       <Link href="/">Home</Link>
//     </div>
//   )
// }
 
 
export default function Map() {
  const searchParams = useSearchParams()
 
  const ship_name = searchParams!.get('ship_name')
  const cruise_name = searchParams!.get('cruise_name')
  const sensor_name = (searchParams?.get('sensor_name') !== null) ? searchParams!.get('sensor_name') : 'b'
  const timestamp = (searchParams?.get('timestamp') !== null) ? searchParams!.get('timestamp') : 0
 
  return (
    <div>
      <h1>Map View {ship_name}</h1>
      <Link href="/">Home</Link>
      <p>ship_name: {ship_name}</p>
      <p>cruise_name: {cruise_name}</p>
      <p>sensor_name: {sensor_name}</p>
      <p>timestamp: {timestamp}</p>
    </div>
  )
}