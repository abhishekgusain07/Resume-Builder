import { ResumeProfile } from "@/app/lib/redux"
import { ResumePDFSection, ResumePDFText } from "./common";
import { spacing } from "./styles";


export const ResumePDFProfile = ({
    profile,
    themeColor,
    isPDF
}:{
    profile: ResumeProfile;
    themeColor: string;
    isPDF: boolean;
}) => {


    const {name, email, phone, url, summary, location} = profile;

    const iconProps = { email, phone, location, url };

    return (
        <ResumePDFSection style = {{marginTop: spacing["4"]}}>
            <ResumePDFText bold={true} themeColor={themeColor} style={{fontSize: "20pt"}}>
                {name}
            </ResumePDFText>
        </ResumePDFSection>
    );
}