import { Intent } from '@blueprintjs/core'
import { FieldMetaState } from 'react-final-form'

export const required = value => (value ? undefined : 'Required')
export const mustBeNumber = value => (isNaN(value) ? 'Must be a number' : undefined)
export const minValue = min => value =>
  isNaN(value) || value >= min ? undefined : `Should be atleast ${min}`
export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined)

export function processMeta(meta: FieldMetaState<any>) {
  const hasError = meta.error && meta.touched

  let intent: Intent;
  if (hasError)
    intent = Intent.DANGER;
  else if (meta.touched && !meta.error)
    intent = Intent.SUCCESS;
  else
    intent = Intent.NONE

  return { hasError, intent };
}
