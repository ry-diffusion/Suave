import AnimatedCube from "./AnimatedCube";

export default function Loading({ message }: { message: string }) {
    return <div className="flex flex-col gap-4">
        <p> {message} </p>
        <AnimatedCube />
    </div>
}