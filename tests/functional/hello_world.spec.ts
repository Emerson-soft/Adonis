import { test } from '@japa/runner'

test.group('Example', () => {
  test('display welcome page', async ({ client }) => {
    const response = await client.get('/')
    response.assertStatus(200)
    response.assertBodyContains({ hello: 'world' })
  })

  test('assert sun', ({ assert }) => {
    assert.equal(2 + 2, 4)
  })
})
