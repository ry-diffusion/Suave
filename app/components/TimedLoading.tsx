import { useEffect, useState } from "react";
import AnimatedCube from "./AnimatedCube";
import CSS from "@/app/styles/TimedCounter.module.css"

export default function TimedLoading({ message }: { message: string }) {
    const [counter, setCounter] = useState(0.1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(c => Number((c + 0.1).toFixed(2)));


        }, 100);
        return () => clearInterval(interval);
    }, []);

    return <div className="flex flex-col gap-4">
        <p className={CSS.counter}> {counter}s </p>

        <p> {message} </p>
        <AnimatedCube />
    </div>
}