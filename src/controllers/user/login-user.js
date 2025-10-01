import { ZodError } from 'zod'
import { loginSchema } from '../../schemas/user.js'
import {
    badRequest,
    notFound,
    ok,
    serverError,
    unauthorized,
} from '../helpers/index.js'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/index.js'

export class LoginUserController {
    constructor(loginUseUserCase) {
        this.loginUseUserCase = loginUseUserCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            await loginSchema.parseAsync(params)
            const user = await this.loginUseUserCase.execute(
                params.email,
                params.password,
            )
            return ok(user)
        } catch (error) {
            if (error instanceof ZodError) {
                return badRequest({
                    message: error.issues[0].message,
                })
            }

            if (error instanceof InvalidPasswordError) {
                return unauthorized()
            }

            if (error instanceof UserNotFoundError) {
                return notFound({
                    message: 'User not found',
                })
            }

            return serverError()
        }
    }
}
