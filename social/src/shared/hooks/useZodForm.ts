import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema, TypeOf } from 'zod';

/**
 * Type-safe form hook combining React Hook Form with Zod schema validation.
 * @param schema Zod validation schema.
 * @param formProps React Hook Form configuration options.
 */
export function useZodForm<TSchema extends ZodSchema<any>>(
  schema: TSchema,
  formProps?: Omit<UseFormProps<TypeOf<TSchema>>, 'resolver'>
): UseFormReturn<TypeOf<TSchema>> {
  return useForm<TypeOf<TSchema>>({
    resolver: zodResolver(schema as any) as any,
    mode: 'onBlur',
    reValidateMode: 'onChange',
    ...formProps,
  });
}
