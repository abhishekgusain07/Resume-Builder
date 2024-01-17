
export const FlexBoxSpacer = ({
    maxWidth, 
    minWidth = 0,
    className = ""
}:{
    maxWidth: number;
    minWidth?: number;
    className?: string;
}) => {
    <div className={`invisible shring-[10000] grow ${className}`} style= {{maxWidth: `${maxWidth}px` , minWidth:`${minWidth}px`}}/>
}