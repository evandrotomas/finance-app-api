import z from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z.uuid({
        message: ' User ID must be a valid UUID.',
    }),
    name: z
        .string({
            message: 'Name is required.',
        })
        .trim()
        .min(1, {
            message: 'Name is required.',
        }),
    date: z.iso.datetime({
        message: 'Date must be a valid date.',
    }),
    type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
        message: 'The type must be EXPENSE, EARNING or INVESTMENT',
    }),
    amount: z
        .number({
            message: 'Amount must be a number.',
        })
        .min(1, {
            message: 'Amount must be greater than 0.',
        })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})

export const updateTransactionSchema = createTransactionSchema
    .omit({
        user_id: true,
    })
    .partial()
