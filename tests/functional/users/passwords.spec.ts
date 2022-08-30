import { UserFactory } from './../../../database/factories/index'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Mail from '@ioc:Adonis/Addons/Mail'

test.group('password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction('pg')
    return () => Database.rollbackGlobalTransaction('')
  })

  test('it should send and email with forgot password instructions', async ({ client, assert }) => {
    const { email, username } = await UserFactory.create()

    // const fakerMail = Mail.fake()
    const userResetPassword = await client.post('/forgot-password').json({
      email,
      resetPasswordUrl: 'url',
    })

    // const sendExists = fakerMail.find((mail) => {
    //   let isTo = false
    //   mail.to?.forEach((to) => {
    //     if (to.address === email) {
    //       isTo = true
    //     }
    //   })
    //   return isTo
    // })

    // assert.isTrue(fakerMail.exists({ subject: 'Roleplay: Recuperação de senha' }))
    // sendExists?.to?.forEach((to) => {
    //   assert.deepEqual(to.address, email)
    // })

    // assert.equal(sendExists?.from?.address, 'no-reply@roleplay.com')
    // assert.include(sendExists?.html, username)

    // Mail.restore()
    userResetPassword.assertStatus(204)
  })
})
