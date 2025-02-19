import Link from "next/link";

export default function UrlLink({ url, children, className }: Readonly<{ url: string, children: React.ReactNode, className: string }>) {
    return <Link href={url} className={`hover:scale-110 rounded-full text-black transition-transform flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 ${className}`} >
        {children}
    </Link>
}