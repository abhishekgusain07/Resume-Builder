// wrapper for all the input componenets that we are going to use during resume-builder

interface InputProps<K extends string, V extends string | string[]>{
    label: string;
    labelClassName?: string;

    name: K;
    value?: V;
    placeholder: string;
    onChange: (name: K, value: V) =>  void;
}


export const InputGroupWrapper = ({
    label, 
    className,
    children
}:{
    label: string,
    className?: string,
    children?: React.ReactNode
}) => {
    return <label className={`text-base font-medium text-gray-700 ${className}`}>
        {label}
        {children}
    </label>
}


export const INPUT_CLASS_NAME = "mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 shadow-sm outline-none font-normal text-base";


export const Input = <K extends string>({
    name, 
    value = "",
    placeholder,
    onChange,
    label,
    labelClassName
}:InputProps<K, string>) => {
    return <InputGroupWrapper label={label} className={labelClassName}>
        <input type="text" name={name} value={value} placeholder={placeholder} onChange={e => onChange(name, e.target.value)} className={INPUT_CLASS_NAME}/>
    </InputGroupWrapper>
}