export const TD_BASE_URL = "https://www.treasurydirect.gov/TA_WS";
export const SECURITIES_BASE_URL = `${TD_BASE_URL}/securities`;

// export const SECURITY_TYPES = ["Bill", "Note", "Bond", "CMB", "TIPS", "FRN"];
export type SECURITY_TYPES_TYPE = "Bill" | "Note" | "Bond";
export const SECURITY_TYPES: SECURITY_TYPES_TYPE[] = ["Bill", "Note", "Bond"];

export const DATE_FORMAT = "YYYY-MM-DD";
