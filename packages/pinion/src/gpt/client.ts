//@ts-ignore
import createClient from '@feathershq/api'

const client = createClient(process.env.PINION_DEV ? 'http://localhost:3030' : 'https://app.feathers.cloud')

export default client
