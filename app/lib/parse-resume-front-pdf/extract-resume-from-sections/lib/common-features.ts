import { Monda } from "next/font/google";
import { FeatureSet, TextItem } from "../../types";
import { hasComma } from "../extract-profile";


// function to check if the text that we pass in the function is in the textItem or not
export const getHasText = (text:string) => (item: TextItem) => {
    return item.text.includes(text)
}


// Date features
const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text)


const MONTHS = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

// checking if the textIem has month name or first three charecter of month name in their text
export const hasMonth = (item: TextItem) => MONTHS.some((month) => item.text.includes(month) || item.text.includes(month.slice(0, 3)));


const SEASONS = [
    "Spring",
    "Summer",
    "Fall",
    "Winter"
];

// checking if item.text has any of the season mentioned above.
const hasSeasons = (item: TextItem) => SEASONS.some((season) => item.text.includes(season));

// checking for "present" in work experience.
const hasPresent = (item: TextItem) => item.text.includes("Present" || "present")


// array of type FeatureSet which is basically an array of tuples, where every item has 2 or 3 things.

// first type => [function, point] => which says if the function returns true, you will get points "points"
// second type => [function, point, booleanVal] => if bolleanVal == true, means the function will return an array, and you will get points "points"
export const DATE_FEATURE_SET: FeatureSet[] = [
    [hasYear, 1],
    [hasMonth, 1],
    [hasSeasons, 1],
    [hasPresent, 1],
    [hasComma, -1]
]