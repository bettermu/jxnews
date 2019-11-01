module.exports = {
  pages:{
    index: {
      entry:'src/pages/index/main.js',
      template:'public/index.html',
      filename:'index.html',
      title:'旅游资讯网'
    },
    person:{
      entry:'src/pages/person/main.js',
      template:'public/person.html',
      filename:'person.html',
      title:'个人中心'
    }
  },
  
  devServer:{
    proxy:`http://10.4.186.162:8086`  
    //proxy:`www.iflyota.com:8086`
  },

  publicPath: process.env.NODE_ENV === 'production'? '/st-news/news' : ''
}