import SuaveCss from '@/app/styles/Suave.module.css'
import Link from 'next/link'

export default function SuaveTitle() {
    return <Link className={`flex flex-col center`} href={'/'}>
        <h1 className={`${SuaveCss.gradient} px-12 text-8xl`}>
            Suave
        </h1>

        <p className="text-sm self-end"> Por Moizes J. Sousa </p>
    </Link>
}