import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { Input, InputProps } from './Input';

export interface FormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> extends Omit<InputProps, 'value' | 'onChangeText' | 'error'> {
  readonly control: Control<TFieldValues>;
  readonly name: TName;
  readonly Component?: React.ComponentType<InputProps>;
}

export const FormField = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  Component = Input,
  ...inputProps
}: FormFieldProps<TFieldValues, TName>): React.ReactElement => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
        const errorProps = error?.message ? { error: error.message } : {};
        return (
          <Component
            value={value ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            {...errorProps}
            {...inputProps}
          />
        );
      }}
    />
  );
};
