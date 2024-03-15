# CryptoApp

## Demo version of web app
https://cryptoapp-demo-site.netlify.app

## Project setup
```
npm install
```

### Update settings
1. Get your API_KEY from https://min-api.cryptocompare.com.
2. Add `VUE_APP_API_KEY=YOR_API_KEY` to environment variables or edit `src/utils/utils.js` file with the folowing code.

```javascript
const API_KEY =
  "YOUR_API_KEY";

export { API_KEY };

```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
