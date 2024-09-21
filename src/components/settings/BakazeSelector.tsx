import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectBakaze, setBakaze } from "../../features/settings/settingsSlice";

/** 場風の選択コンポーネントのProps */
interface BaKazeSelectorProps {}

/** 場風の選択コンポーネント */
const BaKazeSelector = (props: BaKazeSelectorProps) => {
  const dispatch = useAppDispatch();
  const bakaze = useAppSelector(selectBakaze);

  return (
    <div>
      <FormControl>
        {/* タイトル */}
        <FormLabel>場風</FormLabel>

        {/* ラジオグループ */}
        <RadioGroup row={true}>
          {/* 東 */}
          <FormControlLabel
            control={
              <Radio
                checked={bakaze === 0}
                onChange={() => {
                  dispatch(setBakaze(0));
                }}
              />
            }
            label="東"
          />

          {/* 南 */}
          <FormControlLabel
            control={
              <Radio
                checked={bakaze === 1}
                onChange={() => {
                  dispatch(setBakaze(1));
                }}
              />
            }
            label="南"
          />

          {/* 西 */}
          <FormControlLabel
            control={
              <Radio
                checked={bakaze === 2}
                onChange={() => {
                  dispatch(setBakaze(2));
                }}
              />
            }
            label="西"
          />

          {/* 北 */}
          <FormControlLabel
            control={
              <Radio
                checked={bakaze === 3}
                onChange={() => {
                  dispatch(setBakaze(3));
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

export default BaKazeSelector;
