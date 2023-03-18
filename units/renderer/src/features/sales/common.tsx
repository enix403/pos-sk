import cn from 'classnames'

export const financialInputProps = {
  allowNumericCharactersOnly: true,
  clampValueOnBlur: true,
  minorStepSize: null,
  stepSize: 1,
  min: 0
};


/* https://stackoverflow.com/a/2901298 */
export function numberWithCommas(x: number | string) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (parts.length == 2) {
      parts[1] = parts[1].substring(0, 2);
    }

    return parts.join(".");
}

export const StatRow = ({ title, value, ...rest }) => (
  <div {...rest} className={cn("fin-row fin-row-margin", rest.className || '')}>
    <span className="t">{title}</span>
    <span className="v">{numberWithCommas(value)}</span>
  </div>
);
