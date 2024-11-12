export default function Content({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center">
                {children}
            </main>
        </div>
    );
}