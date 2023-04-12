declare module "@mui/x-date-pickers" {
  import { DatePickerProps } from "@mui/lab/DatePicker";
  import { DateRangePickerProps } from "@mui/lab/DateRangePicker";

  export { CalendarPicker } from "@mui/x-date-pickers/CalendarPicker";
  export { DateRangePicker } from "@mui/x-date-pickers/DateRangePicker";

  export type DatePickerProps = DatePickerProps;
  export type DateRangePickerProps = DateRangePickerProps;
}
