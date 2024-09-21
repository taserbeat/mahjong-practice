import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectJikaze, setJikaze } from "../../features/settings/settingsSlice";

/** 場風の選択コンポーネントのProps */
interface JiKazeSelectorProps {}

/** 場風の選択コンポーネント */
const JiKazeSelector = (props: JiKazeSelectorProps) => {
  const dispatch = useAppDispatch();
  const jikaze = useAppSelector(selectJikaze);

  return (
    <div>
      <FormControl>
        {/* タイトル */}
        <FormLabel>自風</FormLabel>

        {/* ラジオグループ */}
        <RadioGroup row={true}>
          {/* 東 */}
          <FormControlLabel
            control={
              <Radio
                checked={jikaze === 0}
                onChange={() => {
                  dispatch(setJikaze(0));
                }}
              />
            }
            label="東"
          />

          {/* 南 */}
          <FormControlLabel
            control={
              <Radio
                checked={jikaze === 1}
                onChange={() => {
                  dispatch(setJikaze(1));
                }}
              />
            }
            label="南"
          />

          {/* 西 */}
          <FormControlLabel
            control={
              <Radio
                checked={jikaze === 2}
                onChange={() => {
                  dispatch(setJikaze(2));
                }}
              />
            }
            label="西"
          />

          {/* 北 */}
          <FormControlLabel
            control={
              <Radio
                checked={jikaze === 3}
                onChange={() => {
                  dispatch(setJikaze(3));
                }}
              />
            }
            label="北"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default JiKazeSelector;
