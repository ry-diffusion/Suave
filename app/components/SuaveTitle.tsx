import SuaveCss from '@/app/styles/Suave.module.css'

export default function SuaveTitle() {
    return <div className={`flex flex-col center`} >
        <h1 className={`${SuaveCss.gradient} px-12 text-8xl`}>
            Suave
        </h1>

        <p className="text-sm self-end"> Por Moizes J. Sousa </p>
    </ div>
}