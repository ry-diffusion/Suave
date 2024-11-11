import CSS from "@/app/styles/Cube.module.css"

export default function AnimatedCube() {
    return <div className={CSS.cube}>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
    </div>
}