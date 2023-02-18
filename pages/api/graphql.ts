import { createProxyMiddleware } from 'http-proxy-middleware'

export const config = {
  api: {
    bodyParser: false,
  },
}

const proxy = createProxyMiddleware({
  target: process.env.NEXT_PUBLIC_STASH_URL,
  pathRewrite: {
    '^/api/graphql': '/graphql',
  },
  changeOrigin: true,
})

export default proxy
