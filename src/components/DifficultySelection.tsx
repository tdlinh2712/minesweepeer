import { RadioGroup, Radio } from "@nextui-org/radio";
import { IDifficultySelection } from "./types";


export const DifficultySelection : React.FC<IDifficultySelection> = ({level, handleSetGameLevel}) => {
    return (
        <div>
        <RadioGroup
            label="Difficulty"
            orientation="horizontal"
            value={level}
            onValueChange={handleSetGameLevel}
        >
            <Radio value="Beginner">Beginner</Radio>
            <Radio value="Intermmediate">Intermmediate</Radio>
            <Radio value="Expert">Expert</Radio>
        </RadioGroup>
    </div>
    );
}