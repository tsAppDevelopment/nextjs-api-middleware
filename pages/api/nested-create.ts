import { createMiddleware, createRouteFactory } from '../../src/index'

const usingGet = createMiddleware(async ({req, res, end}) => {
  const method = String(req.method).toUpperCase()

  res.setHeader('access-control-allow-methods', 'GET')

  if (method !== 'GET') {
    res.status(405).json({ msg: `method: ${method} allowed` })
    end()
  }

  return method
})

const usingHelloParam = createMiddleware(async ({req, res, end}) => {
  const { hello } = req.query

  if (!hello || typeof hello !== 'string') {
    res.status(400).send({ msg: 'hello query param req' })
    end()
  }

  res.setHeader('hello', hello)

  return hello as string
})

const usingBodyKey = createMiddleware(async ({req, res, end}) => {
  const { key } = req.body

  if (!key || typeof key !== 'string') {
    res.status(400).send({ msg: 'key body param req' })
    end()
  }

  return key as string
})

const usingNested = createMiddleware(async ({req, res}) => {
  const method = await usingGet(req, res)
  const hello = await usingHelloParam(req, res)
  const key = await usingBodyKey(req, res)

  return { method, hello, key }
})

const rf = createRouteFactory({})

export default rf.createHandler(async ({req, res, end}) => {
  const { hello, key, method } = await usingNested(req, res)

  res.status(200).json({ hello, key, method })
  end()
})
