import SuaveCss from '@/app/styles/Suave.module.css'
import Link from 'next/link'

export default function SuaveTitle() {
    return <Link className={`flex flex-col center`} href={'/'}>
        <svg height="100" stroke="#D2A8FF" strokeWidth="2" className={SuaveCss.suave} width="100%">
            <text x="50%" dominantBaseline="middle" textAnchor="middle" y="50%">Suave</text>
        </svg>

        <p className="text-sm self-end"> Por Moizes J. Sousa </p>
    </Link>
}