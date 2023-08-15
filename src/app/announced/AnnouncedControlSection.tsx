import Stack from "@mui/material/Stack";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { SECURITY_TYPES, SECURITY_TYPES_TYPE } from "@/constancts";
import { FC } from "react";

interface AnnouncedControlSectionProps {
  securityType: SECURITY_TYPES_TYPE;
  days: number;
  onChangeSecurityType: (
    event: React.MouseEvent<HTMLElement>,
    value: SECURITY_TYPES_TYPE
  ) => void;
  onChangeDays: (event: React.MouseEvent<HTMLElement>, value: number) => void;
}

const DAYS = [
  { label: "Today", value: 0 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
];

const AnnouncedControlSection: FC<AnnouncedControlSectionProps> = ({
  securityType,
  days,
  onChangeSecurityType,
  onChangeDays,
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
        value={days}
        exclusive
        aria-label="number of days button group"
        onChange={onChangeDays}
        size="small"
        color="primary"
      >
        {DAYS.map(({ label, value }) => (
          <ToggleButton key={label} value={value} aria-label={`${label}`}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
};

export default AnnouncedControlSection;
