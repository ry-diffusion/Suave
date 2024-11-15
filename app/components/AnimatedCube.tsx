import CSS from "@/app/styles/Cube.module.css"
import SuaveCss from "@/app/styles/Suave.module.css"

export default function AnimatedCube() {
    return <div className={`${CSS.cube} border-solid border-green-200 border-2 rounded-full`}>
        <div className={CSS.side}>
            <p className={`${SuaveCss.gradient} mt-auto ml-auto text-center text-sm`}>
                S
            </p>
        </div>
        <div className={CSS.side}>
            <p className={`${SuaveCss.gradient} mt-auto ml-auto text-center text-sm rotate-90`}>
                S
            </p>
        </div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
        <div className={CSS.side}></div>
    </div>
}