import { ZodError } from 'zod'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { updateUserSchema } from '../../schemas/index.js'
import {
    checkIfIdIsValid,
    invalidIdResponse,
    badRequest,
    ok,
    serverError,
} from '../helpers/index.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = checkIfIdIsValid(userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateUserSchema.parseAsync(params)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                params,
            )

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({
                    message: error.message,
                })
            }

            console.error(error)
            return serverError()
        }
    }
}
