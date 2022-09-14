import Drive from '@ioc:Adonis/Core/Drive'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GooglesController {
  public async save({ request, response }: HttpContextContract) {
    const file = request.file('file')

    await file?.moveToDisk('', {}, 'gcs')

    const gcs = Drive.use('gcs')
    const url = await gcs.getSignedUrl(file?.fileName!)
    response.ok({
      url: url,
    })
  }
}
