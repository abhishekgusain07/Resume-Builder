import { cx } from "@/app/lib/cx"
import { useSaveStateStoreToLocalStorage, useSetInitialStore } from "@/app/lib/redux/hooks"
import { useState } from "react"
import { ProfileForm } from "./ProfileForm"



export const ResumeForm = () => {
    useSetInitialStore()
    useSaveStateStoreToLocalStorage()

    const [isHover, setIsHover] = useState(false)

    return (
        <div className={cx("flex justify-center scrollbar scrollbar-track-gray-100 scrollbar-w-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end overflow-y-scroll", isHover && "scrollbar-thumb-gray-200")}
        onMouseOver={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        >
            <section className="flex flex-col max-w-2xl gap-8 p-[var(--resume-padding)]">
                <ProfileForm />
            </section>
        </div>
    )
}