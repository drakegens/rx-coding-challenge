import Moment from "moment-timezone";

const date_key_regex = /(_on|_at)$/;
const exact_date_regex = /^\d{4}-\d{2}-\d{2}$/;

export function dateReviver(key: string, value: string) {
  if (
    date_key_regex.test(key) &&
    value !== null &&
    !exact_date_regex.test(value) &&
    Moment(value, Moment.ISO_8601, true).isValid()
  ) {
    return new Date(value);
  }

  return value;
}

export function parseJSONWithDates(content: string) {
  return JSON.parse(content, dateReviver);
}
