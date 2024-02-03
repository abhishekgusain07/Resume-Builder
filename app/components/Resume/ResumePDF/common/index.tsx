import { View, Text} from "@react-pdf/renderer";
import type {Style} from "@react-pdf/types"
import {styles, spacing} from "../styles"
import { DEFAULT_FONT_COLOR } from "@/app/lib/redux/settingSlice";


// A wrapper for PDF section in resume-builder.
export const ResumePDFSection = ({
    themeColor,
    heading,
    style,
    children
}:{
    themeColor?: string;
    heading?: string;
    style?: Style;
    children: React.ReactNode
}) => {
    return <View 
    style={{...styles.flexCol,
        gap: spacing["2"],
        marginTop: spacing["5"],
        ...style
    }}>
        {
            heading && (
                <View style={{
                    ...styles.flexRow,
                    alignItems: "center"
                }}>
                    {themeColor && (
                            <View style={{
                                height: "3.75pt",
                                width:"30pt",
                                backgroundColor: themeColor,
                                marginRight: spacing["3.5"]
                            }}/>
                    )}
                    <Text style={{
                        fontWeight: "bold",
                        letterSpacing: "0.3pt"
                    }}>
                        {heading}
                    </Text>
                </View>
            )
        }
        {children}
    </View>
}


// Wrapper for text inside pdf section.
export const ResumePDFText = ({
    bold = false, 
    themeColor,
    style = {},
    children
}:{
    bold?: boolean;
    themeColor?: string;
    style?: Style;
    children: React.ReactNode
}) => {
    return <Text style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        ...style
    }}>
        {children}
    </Text>
}