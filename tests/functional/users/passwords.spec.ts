import { UserFactory } from './../../../database/factories/index'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Mail from '@ioc:Adonis/Addons/Mail'

test.group('password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction('pg')
    return () => Database.rollbackGlobalTransaction('')
  })

  test('it should send and email with forgot password instructions', async ({ client }) => {
    const { email } = await UserFactory.create()

    const fakerMail = Mail.fake()
    fakerMail.exists({ subject: 'Roleplay: Recuperação de senha' })
    const userResetPassword = await client.post('/forgot-password').json({
      email,
      resertPasswordUrl: 'url',
    })

    Mail.restore()
    userResetPassword.assertStatus(204)
  })
})
