import Image from 'next/image';
import Link from 'next/link';


export default function ErrorDialog({ error }: { error: string }) {
    return (
        <div className="flex flex-col gap-4 items-center p-10">
            <Image className='black bg-red-200 rounded-full' src="/sad-sit.svg" alt="Error" width={128} height={128} />

            <div className="flex">
                <h1 className="text-red-400">Ocorreu um erro inesperado! Desculpe!</h1>
            </div>

            <div className="flex gap-2 items-center">
                <Image className='black bg-red-200 rounded-full' src="/error.svg" alt="Error" width={20} height={20} />

                <pre className='text-red-400'>{error}</pre>
            </div>

            <Link href="/Inicio" className="hover:scale-110 rounded-full text-black transition-transform flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 bg-blue-300">
                Voltar a página inicial
            </Link>
        </div>
    );
}