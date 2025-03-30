import { Heading } from '@radix-ui/themes'
import Link from 'next/link'

export default function SuaveTitle() {
    return <Link className={`flex flex-col center`} href={'/'}>
        <Heading as="h1" size="9"> Suave </Heading>
        {/* <p className="text-sm self-end"> Por Moizes J. Sousa </p> */}
    </Link>
}