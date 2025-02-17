import { StyleSheet } from "react-native";
enum Sex {
    MALE = "Mâle",
    FEMALE = "Femelle",
}


const getIcon = (sex : Sex) => {
    switch (sex) {
        case Sex.MALE:
            return "gender-male";
        case Sex.FEMALE:
            return "gender-female";

        default:
            return "gender-female";
    }}

    const getBackgroundColor = (sex : Sex) => {
        switch (sex) {
            case Sex.MALE:
                return styles.male.color;
            case Sex.FEMALE:
                return "#a17884";
    
            default:
                return styles.female.color;
        }}


        const styles = StyleSheet.create({
            male: {
                color: "#6c998d",
            },
            female: {
                color: "#a17884"
            }
        });

        export { getIcon, getBackgroundColor};