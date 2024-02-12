import { useState } from "react";
import { cx } from "../lib/cx";
import Image from "next/image";
import addPdfSrc from "@/public/assets/add-pdf.svg";
import { LockClosedIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { parseResumeFromPdf } from "../lib/parse-resume-front-pdf";
import { deepClone } from "../lib/parse-resume-front-pdf/deep-clone";
import { ShowForm, initialSettings } from "../lib/redux/settingSlice";
import { getHasUsedAppBefore, saveStateToLocalStorage } from "../lib/redux/local-storage";
import { useRouter } from "next/navigation";

// default file state before anything is dropped in drop zone.
const defaultFileState = {
    name: "",
    size: 0,
    fileUrl: ""
}
export const ResumeDropZone = ({
    onFileUrlChange,
    className,
    playgroundView = false,
}: {
    onFileUrlChange: (fileUrl: string) => void;
    className?: string;
    playgroundView?: boolean
}) => {
    const [file, setFile] = useState(defaultFileState)
    const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false)
    const [hasNonPdfFile, setHasNonPdfFile] = useState(false)
    const router = useRouter()

    const hasFile = Boolean(file.name);


    // that file we obtain after dropping into the drop zone need to be of certain structure, we do that in this function
    const setNewFile = (newFile: File) => {
        if(file.fileUrl) {
            URL.revokeObjectURL(file.fileUrl)
        }
        const {name, size} = newFile
        const fileUrl = URL.createObjectURL(newFile)
        setFile({name, size, fileUrl})
        onFileUrlChange(fileUrl)
    }
    // handles when we drop some file into the drop zone.
    const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const newFile = event.dataTransfer.files[0]!
        if(newFile.name.endsWith(".pdf")) {
            setHasNonPdfFile(false)
            setNewFile(newFile)
        } else {
            setHasNonPdfFile(true)
        }
        setIsHoveredOnDropzone(false)
    }

    const onRemove = () => {
        setFile(defaultFileState)
        onFileUrlChange("")
    }
    const onInputChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if(!files)return

        const newFile = files[0]!
        setNewFile(newFile)
    }


    // == The main button, when the user puts the resume, it will be parsed by the functions we wrote and shown to the  user.
    const onImportClick = async() => {
        const resume = await parseResumeFromPdf(file.fileUrl)
        const settings = deepClone(initialSettings)
        if(getHasUsedAppBefore()) {
            const sections = Object.keys(settings.formToShow) as ShowForm[]
            const sectionToFormShow: Record<ShowForm, boolean> = {
                workExperiences: resume.educations?.length > 0,
                educations: resume.educations?.length > 0,
                projects: resume.projects?.length > 0,
                skills: resume.skills?.descriptions.length > 0,
                custom: resume.custom?.descriptions.length > 0
            }

            for(const section of sections) {
                settings.formToShow[section] = sectionToFormShow[section]
            }
        }
        saveStateToLocalStorage({resume, settings})
        router.push("/resume-builder")
    }


    return (
        <div className={cx("flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6",
        isHoveredOnDropzone && "border-sky-400",
        playgroundView ? "pb-6 pt-4":"py-12",
        className)}
            onDragOver={(event) => {
                event.preventDefault()
                setIsHoveredOnDropzone(true)
            }}
            onDragLeave={() => setIsHoveredOnDropzone(false)}
            onDrop={onDrop}
        >
            <div className={cx("text-center",
            playgroundView ? "space-y-2" : "space-y-3")}>
                {
                    !playgroundView && (
                        <Image 
                            src={addPdfSrc}
                            alt = "Add Pdf"
                            className="mx-auto h-14 w-14"
                            aria-hidden="true"
                            priority
                        />
                    )
                }
                {
                    !hasFile ? (
                        <>
                            <p className={cx("pt-3 text-gray-700",
                            !playgroundView && "text-lg font-semibold")}>
                                Browse a pdf file and drop it here
                            </p>
                            <p className="flex text-gray-500 text-sm">
                                <LockClosedIcon  className="mr-1 mt-1 h-3 w-3 text-gray-400"/>
                                File Data is used locally and never leaves your browser
                            </p>
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-3 pt-3">
                            <div className="pt-7 font-semibold text-gray-900">
                                {file.name} -{getFileSizeString(file.size)}
                            </div>
                            <button type="button" className="outline-theme-blue rounded-md p-1 text-gray-400 hover:bg-gray-1000
                            hover:text-gray-500"
                            title="Remove File"
                            onClick={onRemove}
                            >
                                <XMarkIcon className="bg-black-400 h-6 w-6" />
                            </button>
                        </div>
                    )}
                    <div className="pt-4">
                        {
                            !hasFile ? (
                               <>
                                <label className={cx("within-outline-theme-purple cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm", playgroundView ? "border":"bg-primary " )}>
                                    Browse File
                                    <input type="file" className="sr-only" accept=".pdf"
                                onChange={onInputChange}
                                />
                                </label>
                                {
                                    hasNonPdfFile && (
                                        <p className="mt-6 text-red-400">
                                            Only Pdf File is Supported
                                        </p>
                                    )
                                }
                               </> 
                            ) : (
                                <>
                                    {
                                        !playgroundView && (
                                            <button type="button" className="btn-primary" onClick={onImportClick}>
                                                Import and Continue
                                            </button>
                                        )}
                                        <p className={cx(" text-gray-500 ", !playgroundView && "mt-6")}>
                                            Note: {!playgroundView ? "Import":"Parser"} works best on single column Resume
                                        </p>       
                                </>
                            )}
                    </div> 
            </div>
        </div>
    )
}

const getFileSizeString = (fileSizeB: number) => {
    const fileSizeKB = fileSizeB/1024;
    const fileSizeMb = fileSizeKB/1024;
    if(fileSizeKB < 1000) {
        return fileSizeKB.toPrecision(3) + "Kb"
    } else {
        return fileSizeMb.toPrecision(3) + "Mb"
    }
}