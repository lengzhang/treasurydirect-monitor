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

interface ControlSectionInterface {
  type: SECURITY_TYPES_TYPE;
  isPriceDisplayMode: boolean;
  onSelectSecurityType: (event: ChangeEvent<HTMLInputElement>) => void;
  onSwitchDisplayMode: MouseEventHandler<HTMLButtonElement>;
}

const ControlSection: FC<ControlSectionInterface> = ({
  type,
  isPriceDisplayMode,
  onSelectSecurityType,
  onSwitchDisplayMode,
}) => {
  return (
    <Stack direction={"row"} spacing={2} flexWrap={"wrap"}>
      <FormControl>
        <FormLabel id="security-type-label">Security Type</FormLabel>
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
        <FormLabel id="data-mode-label">Data Mode</FormLabel>
        <Stack direction={"row"} flexWrap={"nowrap"} alignItems={"center"}>
          <Typography>Rate</Typography>
          <Switch checked={isPriceDisplayMode} onClick={onSwitchDisplayMode} />
          <Typography>Price</Typography>
        </Stack>
      </FormControl>
    </Stack>
  );
};

export default ControlSection;
