import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import SendEmailValidator from 'App/Validators/SendEmailValidator'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const body = await request.validate(SendEmailValidator)

    const user = await User.findByOrFail('email', body.email)

    await Mail.send((msg) => {
      msg
        .from('no-reply@roleplay.com')
        .to(body.email)
        .subject('Roleplay: Recuperação de senha')
        .htmlView('email/forgotpassword', {
          productName: 'Roleplay',
          name: user.username,
          resetPasswordUrl: 'google.com.br',
        })
    })

    return response.noContent()
  }
}
