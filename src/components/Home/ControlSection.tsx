import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { ChangeEvent, FC, MouseEventHandler } from "react";
import ControlSectionFrom from "./ControlSectionFrom";
import { Dayjs } from "dayjs";

interface ControlSectionInterface {
  type: SECURITY_TYPES_TYPE;
  isPriceDisplayMode: boolean;
  sinceFrom: Dayjs | null;
  onSelectSecurityType: (event: ChangeEvent<HTMLInputElement>) => void;
  onSwitchDisplayMode: MouseEventHandler<HTMLButtonElement>;
  onChangeSinceFrom: (value: Dayjs | null) => void;
}

const ControlSection: FC<ControlSectionInterface> = ({
  type,
  isPriceDisplayMode,
  sinceFrom,
  onSelectSecurityType,
  onSwitchDisplayMode,
  onChangeSinceFrom,
}) => {
  return (
    <Stack direction={"row"} spacing={3} flexWrap={"wrap"} alignItems="center">
      <FormControl>
        <FormLabel id="security-type-label">Security type</FormLabel>
        <RadioGroup
          row
          name="security-type-group"
          value={type}
          onChange={onSelectSecurityType}
        >
          {SECURITY_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              value={type}
              control={<Radio />}
              label={type}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl>
        <FormLabel id="data-mode-label">Data mode</FormLabel>
        <Stack direction={"row"} flexWrap={"nowrap"} alignItems={"center"}>
          <Typography>Rate</Typography>
          <Switch checked={isPriceDisplayMode} onClick={onSwitchDisplayMode} />
          <Typography>Price</Typography>
        </Stack>
      </FormControl>
      <ControlSectionFrom value={sinceFrom} onChange={onChangeSinceFrom} />
    </Stack>
  );
};

export default ControlSection;
