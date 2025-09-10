export default function loggermiddleware(req, res, next) {
  console.log(`hello from logger middleware, here is the method: ${req.method} and url : ${req.url}`)
  res.json({ msg: 'hello from logger middleware' })
  next()
}
