const STEPS = [
    {title: "Add a resume pdf", text: "or create from scratch"},
    {title: "Preview Design", text: "and make edits"},
    {title: "Download new resume", text: "and apply with confidence"}
]

export const Steps = () => {
    return (
    <section className="mx-auto mt-8 rounded-2xl bg-sky-50 bg-dot px-8 pb-12 pt-10 lg:mt-2">
        <h1 className="text-center text-3xl font-bold">3 Simple Steps</h1>
        <div className="mt-8 flex justify-center">
            <dl className="flex flex-col gap-y-10 lg:flex-row lg:gap-x-20 lg:justify-center">
                {
                    STEPS.map(({title, text}, idx) => (
                        <div key={title}
                        className="relative self-start pl-14">
                           <dt className="text-lg font-bold">
                                <div className="bg-primary absolute left-0 top-1 flex h-10 w-10 select-none items-center rounded-full p-[3.5px]">
                                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                                        <div className="text-primary -mt-0.5 text-2xl">
                                            {idx+1}
                                        </div>
                                    </div>
                                </div>
                                {title}
                            </dt> 
                            <dd>{text}</dd>
                        </div>
                    ))
                }
            </dl>
        </div>
    </section>
    )
}