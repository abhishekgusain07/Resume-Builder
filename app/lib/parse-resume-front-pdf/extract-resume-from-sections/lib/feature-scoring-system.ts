import {FeatureSet, TextItem, TextItems, TextScores} from "../../types"


// function to compute which words are good enought when compared with the rules in feature set and scored on basis of it.
// returns array of TextScores which contain textscore which contain an object which contain text, score and the match arary (all the match that were found in text when matched with the help of regex)
const computeFeatureStore = (
    textItems : TextItems,
    featureSets: FeatureSet[]
) : TextScores => {
    const textScores = textItems.map((item) => ({
        text: item.text,
        score: 0,
        match: false
    }))

    for(let i = 0; i < textItems.length; ++i) {
        const textItem: TextItem = textItems[i];
        for(const featureSet of featureSets) {
            const [hasFeature, score, returnMachingText] = featureSet
            const result = hasFeature(textItem)
            if(result) {
                let text = textItem.text
                if(returnMachingText && typeof result === "object") {
                    text = result[0]
                }

                const textScore = textScores[i]
                if(textItem.text === text) {
                    textScore.score += score
                    if(returnMachingText) {
                        textScore.match = true
                    }
                } else {
                    textScores.push({text,score,match:true})
                }
            }
        }
    }
    return textScores;
};



export const getTextWithHighestFeatureScore = (
    textItems: TextItems,
    featureSets: FeatureSet[],
    returnEmptyStringIfHighestScoreIsNotPositive = true,
    returnConcatenatedStringForTextWithSameHighestScore = false,
)=> {

    const textScores = computeFeatureStore(textItems, featureSets);

    let textWithHighestFeatureScore: string[] = []
    let highestScore = -Infinity

    for (const {text, score} of textScores) {
        if(score >= highestScore) {
            if(score > highestScore){
                textWithHighestFeatureScore = []
            }
            textWithHighestFeatureScore.push(text)
            highestScore = score;
        }
    }
    if(returnEmptyStringIfHighestScoreIsNotPositive && highestScore <= 0) {
        return ["", textScores] as const;
    }

    const text = !returnConcatenatedStringForTextWithSameHighestScore ? textWithHighestFeatureScore[0] : textWithHighestFeatureScore.map((s) => s.trim()).join(" ")
    return [text, textScores] as const;
}   