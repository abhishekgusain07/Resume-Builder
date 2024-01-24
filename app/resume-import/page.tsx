"use client"

import { useEffect, useState } from "react"
import { getHasUsedAppBefore } from "../lib/redux/local-storage";
import Link from "next/link";

export default function ImportResume() {
    const [hasUsedAppBefore, setHasUsedAppBefore] = useState(false)
    const [hasAddedResume, setHasAddedResume] = useState(false)


    const onFileUrlChange = (fileUrl: string) => {
        setHasAddedResume(Boolean(fileUrl));
    };

    useEffect(() => {
        setHasUsedAppBefore(getHasUsedAppBefore());
    },[]);

    return(
        <main>
            <div className="mx-auto mt-14 max-w-3xl rounded-md border border-gray-200 px-10 py-10 text-center shadow-md">
                {
                    !hasUsedAppBefore ? (
                        <>
                            <h1 className="text-lg font-semibold text-gray-900">
                                Import Data from an existing Resume
                            </h1>
                            <h2>Resume Drop Zone Componenet</h2>
                            {
                                !hasAddedResume && (
                                    <>
                                        <OrDivider/>
                                        <SectionWithHeadingAndCreateButton heading="Don't have resume yet"
                                        buttonText="Create from Scratch" />
                                    </>
                                )
                            }
                        </>
                    ) : (
                        <>
                        {
                            !hasAddedResume && (
                                <>
                                    <SectionWithHeadingAndCreateButton heading="you have data saved in browser from prior session"
                                    buttonText="Continue where I left off" />
                                    <OrDivider />
                                </>
                            )}
                            <h1 className="text-lg font-semibold text-gray-500">
                                Import Data from an existing resume
                            </h1>
                            <h1> Resume Drop Zone Componenet</h1>
                        </>
                    )
                }
            </div>
        </main>
    )
}

const OrDivider = () => (
    <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
      <div className="flex-grow border-t border-gray-200" />
      <span className="mx-2 mt-[-2px] flex-shrink text-lg text-gray-400">or</span>
      <div className="flex-grow border-t border-gray-200" />
    </div>
);

const SectionWithHeadingAndCreateButton = ({
    heading,
    buttonText
}:{
    heading: string;
    buttonText: string;
}) => {
    return(
        <>
            <p className="font-semibold text-gray-900">{heading}</p>
            <div className="mt-3">
                <Link href="/reumse-builder" className="outline-theme-blue rounded-full bg-sky-500 px-6 pb-2 pt-1.5 text-base font-semibold text-white">
                    {buttonText}
                </Link>
            </div>
        </>
    )
}