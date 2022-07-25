import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const userByEmail = await User.findBy('email', userPayload.email)
    const userByUsername = await User.findBy('username', userPayload.username)

    if (userByEmail) {
      throw new BadRequestException('email already in used', 409)
    }

    if (userByUsername) {
      throw new BadRequestException('username already in used', 409)
    }

    const user = await User.create(userPayload)

    return response.created({ user })
  }

  public async update({ request, response }: HttpContextContract) {
    const { email, avatar, password } = request.only(['email', 'avatar', 'password'])
    const id = request.param('id')
    const user = await User.findOrFail(id)

    user.email = email
    user.password = password
    if (avatar) user.avatar = avatar
    user.save()

    return response.ok({ user })
  }
}
