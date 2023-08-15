import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FC } from "react";
import dayjs, { Dayjs } from "dayjs";
import useMount from "@/hooks/useMount";

interface SinceFromDatePickerProps {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

const SinceFromDatePicker: FC<SinceFromDatePickerProps> = ({
  value,
  onChange,
}) => {
  const isMount = useMount();
  if (!isMount) return null;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
      <DatePicker
        label="Since from"
        value={value}
        onAccept={onChange}
        slotProps={{
          textField: { size: "small" },
        }}
        maxDate={dayjs()}
      />
    </LocalizationProvider>
  );
};

export default SinceFromDatePicker;
