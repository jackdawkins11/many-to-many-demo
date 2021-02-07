const path = require("path")

module.exports = {
    entry: { index: path.resolve(__dirname, "react", "App.js") },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    }
};