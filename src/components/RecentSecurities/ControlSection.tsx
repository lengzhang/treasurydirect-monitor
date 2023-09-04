import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Dayjs } from "dayjs";
import { FC } from "react";
import SinceFromDatePicker from "./SinceFromDatePicker";

interface RecentSecuritiesControlSectionProps {
  securityType: SECURITY_TYPES_TYPE;
  displayMode: "price" | "rate";
  sinceFrom: Dayjs;
  onChangeSecurityType: (
    event: React.MouseEvent<HTMLElement>,
    value: SECURITY_TYPES_TYPE,
  ) => void;
  onChangeDisplayMode: (
    event: React.MouseEvent<HTMLElement>,
    value: "price" | "rate",
  ) => void;
  onChangeSinceFrom: (value: Dayjs | null) => void;
}

const RecentSecuritiesControlSection: FC<
  RecentSecuritiesControlSectionProps
> = ({
  securityType,
  displayMode,
  sinceFrom,
  onChangeSecurityType,
  onChangeDisplayMode,
  onChangeSinceFrom,
}) => {
  return (
    <Stack
      direction={"row"}
      paddingY={2}
      spacing={{ xs: 1, sm: 2, md: 4 }}
      useFlexGap
      flexWrap={"wrap"}
    >
      <ToggleButtonGroup
        value={securityType}
        exclusive
        aria-label="security type button group"
        onChange={onChangeSecurityType}
        size="small"
        color="primary"
      >
        {SECURITY_TYPES.map((type) => (
          <ToggleButton
            key={type}
            value={type}
            aria-label={`${type} security type`}
          >
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        value={displayMode}
        exclusive
        aria-label="display mode button group"
        onChange={onChangeDisplayMode}
        size="small"
        color="primary"
      >
        {["price", "rate"].map((mode) => (
          <ToggleButton
            key={mode}
            value={mode}
            aria-label={`${mode} display mode`}
          >
            {mode}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <SinceFromDatePicker value={sinceFrom} onChange={onChangeSinceFrom} />
    </Stack>
  );
};

export default RecentSecuritiesControlSection;
