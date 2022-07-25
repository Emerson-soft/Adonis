import { UserFactory } from './../../../database/factories/index'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction('pg')
    return () => Database.rollbackGlobalTransaction('pg')
  })

  test('it should create an user', async ({ assert, client }) => {
    const userPayload = {
      email: 'emerson@gmahhil.com',
      username: 'zanllg',
      password: '1234',
      avatar: '',
    }

    const response = await client.post('/users').json(userPayload)
    const body = response.body()
    response.assertStatus(201)
    assert.exists(body.user.id, 'id undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.equal(body.user.avatar, userPayload['avatar'] || undefined)
    assert.notExists(body.user.password, 'Password defined')
  })

  test('it should return 409 when email is already in use', async ({ assert, client }) => {
    const { email } = await UserFactory.create()

    const response = await client.post('/users').json({
      email,
      username: 'test',
      password: '5544',
    })

    response.assertStatus(409)
    const body = response.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return 409 when username is already in use', async ({ assert, client }) => {
    const { username } = await UserFactory.create()

    const response = await client.post('/users').json({
      email: 'test@test.com.br',
      username,
      password: '5544',
    })

    response.assertStatus(409)
    const body = response.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'username')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return 422 when required data is not provided', async ({ assert, client }) => {
    const response = await client.post('/users').json({})
    const body = response.body()
    response.assertStatus(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when providing an invalid email', async ({ assert, client }) => {
    const response = await client.post('/users').json({
      email: 'test@',
      password: 'TesteA@',
      username: 'heloooo',
    })
    const body = response.body()
    response.assertStatus(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when providing an invalid password', async ({ assert, client }) => {
    const response = await client.post('/users').json({
      email: 'test@goflux.com',
      password: 'T',
      username: 'heloooo',
    })
    const body = response.body()
    response.assertStatus(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should update an user', async ({ assert, client }) => {
    const { id, password } = await UserFactory.create()
    const email = 'Test@goflux.com'
    const avatar = 'http://github.com/Emerson-soft.png'
    const response = await client.put(`/users/${id}`).json({
      email,
      avatar,
      password,
    })
    const body = response.body()

    response.assertStatus(200)
    assert.exists(body.user, 'User undefined')
    assert.equal(body.user.email, email)
    assert.equal(body.user.avatar, avatar)
    assert.equal(body.user.id, id)
  })

  test('it should update the password of the user', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const password = 'test'

    const response = await client.put(`/users/${user.id}`).json({
      email: user.email,
      avatar: user.avatar,
      password,
    })
    const body = response.body()

    response.assertStatus(200)
    assert.exists(body.user, 'User undefined')
    assert.equal(body.user.id, user.id)

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })
})
