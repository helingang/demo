//用于postcss

const autoprefixer = require('autoprefixer')

// autoprefixer用于后处理css样式的(处理加前缀的css样式)
module.exports = {
    plugins: [
        autoprefixer()
    ]
}