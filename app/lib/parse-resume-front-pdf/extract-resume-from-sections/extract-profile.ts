import { hasLetter, hasLetterAnsIsAllUpperCase, isBold } from "../group-lines-into-sections";
import { FeatureSet, TextItem } from "../types"
import { ResumeSectionToLines } from "../types";
import { getTextWithHighestFeatureScore } from "./lib/feature-scoring-system";
import { getSectionLinesByKeywords } from "./lib/get-section-lines";




// name
export const matchOnlyLetterSpaceOrPeriod = (items: TextItem) => items.text.match(/^[A-Za-z\s\.]+$/)

// email
export const matchEmail = (item: TextItem) => item.text.match(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/)
const hasAt = (item: TextItem) => item.text.includes("@");

// phone
export const matchPhone = (item: TextItem) => item.text.match(/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/)
export const hasParenthesis = (item: TextItem) => /\([8-9]+\)/.test(item.text)
export const hasAllNumbers = (item: TextItem) => /[0-9]/.test(item.text);


// location
export const matchCityAndState = (item: TextItem) => item.text.match(/[A-Z][a-zA-Z\s]+,[A-Z]{3}/)
export const hasComma = (item: TextItem) => item.text.includes(",");

// Url
export const matchUrl = (item: TextItem) => item.text.match(/\S+\.[a-z]+\/\S+/)

const matchUrlHttpFallBack = (item:TextItem) => item.text.match(/https?:\/\/\S+\.\S+/)

const matchUrlWwwwFallback = (item: TextItem) => item.text.match(/www?:\/\/\S+\.\S+/)
 
const hasSlash = (item: TextItem) => item.text.includes("/");

// summary
const has4OrMoreWords = (item: TextItem) => item.text.split(" ").length >= 4;



const NAME_FEATURE_SETS: FeatureSet[] = [
    [matchOnlyLetterSpaceOrPeriod, 3, true],
    [isBold, 2],
    [hasLetterAnsIsAllUpperCase, 2],
    [hasAt, -4],
    [hasParenthesis, -4],
    [has4OrMoreWords, -2],
    [hasComma, -4]
];

const EMAIL_FEATURE_SETS: FeatureSet[] = [
    [matchEmail, 4, true],
    [isBold, -1],
    [hasLetterAnsIsAllUpperCase, -1],
    [hasSlash, -4],
    [hasParenthesis, -4],
    [has4OrMoreWords, -4],
    [hasComma, -4]
];

const PHONE_FEATURE_SETS: FeatureSet[] = [
    [matchPhone, 4, true],
    [hasLetter, -4]
];

const LOCATION_FEATURE_SETS: FeatureSet[] = [
    [matchCityAndState, 4, true],
    [isBold, -1],
    [hasAt, -4],
    [hasParenthesis, -4],
    [hasSlash, -4]
];

const URL_FEATURE_SETS: FeatureSet[] = [
    [matchUrl, 4, true],
    [matchUrlHttpFallBack, 3, true],
    [matchUrlWwwwFallback,3 , true],
    [isBold, -1],
    [hasAt, -4],
    [hasParenthesis, -3],
    [has4OrMoreWords, -4],
    [hasComma, -4]
];

const SUMMARY_FEATURE_SETS: FeatureSet[] = [
    [has4OrMoreWords, 4],
    [matchCityAndState, -4, false],
    [isBold, -1],
    [hasAt, -4],
    [hasParenthesis, -3],
];

export const extractProfile = (sections: ResumeSectionToLines) => {
    const lines = sections.profile || []
    const textItems = lines.flat()
    const [name, nameScores] = getTextWithHighestFeatureScore(
        textItems,
        NAME_FEATURE_SETS
    );
    
    const [email, emailScores] = getTextWithHighestFeatureScore(
        textItems,
        EMAIL_FEATURE_SETS
    );
    const [phone, phoneScores] = getTextWithHighestFeatureScore(
        textItems,
        PHONE_FEATURE_SETS
    );
    const [location, locationScores] = getTextWithHighestFeatureScore(
        textItems,
        LOCATION_FEATURE_SETS
    );
    const [url, urlScores] = getTextWithHighestFeatureScore(
        textItems,
        URL_FEATURE_SETS
    );
    const [summary, summaryScores] = getTextWithHighestFeatureScore(
        textItems,
        SUMMARY_FEATURE_SETS,
        undefined,
        true
    );

    const summaryLines = getSectionLinesByKeywords(sections,["summary"]);
    const summarySection = summaryLines.flat().map((textItem) => textItem.text).join(" ")

    const objectiveLines = getSectionLinesByKeywords(sections,["objective"]);
    const objectiveSection = objectiveLines.flat().map((textItem) => textItem.text).join(" ")

    return {
        profile:{
            name, 
            email,
            phone, 
            location,
            url, 
            summary: summarySection || objectiveSection || summary,
        },
        profileScores: {
            name: nameScores,
            email: emailScores,
            phone: phoneScores,
            location: locationScores,
            url: urlScores,
            summary: summaryScores
        }
    }
}