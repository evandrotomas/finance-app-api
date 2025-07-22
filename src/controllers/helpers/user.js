import { badRequest, notFound } from './http.js'

export const invalidPasswordResponse = () =>
    badRequest({
        Message: 'Password must be at least 6 characters',
    })

export const emailIsAlreadyInUseResponse = () =>
    badRequest({
        Message: 'Invalid email. Please provide a valid one.',
    })

export const userNotFoundResponse = () =>
    notFound({
        message: 'User not found',
    })
