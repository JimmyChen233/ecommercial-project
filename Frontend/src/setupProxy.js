const proxy = require('http-proxy-middleware')

module.exports = function(app){
  app.use(
    proxy('/api1',{
      // target: 'http://127.0.0.1:8080',
      target: 'http://ec2-13-236-232-143.ap-southeast-2.compute.amazonaws.com',
      changeOrigin: true,
      pathRewrite: {'^/api1':''}
    })
  )
}