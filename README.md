# PicScout

[![codecov](https://codecov.io/gh/JMax45/picscout/branch/master/graph/badge.svg?token=6HK7W42XCV)](https://codecov.io/gh/JMax45/picscout)
[![npm](https://img.shields.io/npm/v/picscout?logo=npm)](https://www.npmjs.com/package/picscout)

PicScout is an NPM module that allows you to search for images using various search engines, currently included ones are Google and Bing.

## Installation

To install the package, use the following command:

```bash
npm install picscout
```

## Usage

Here's an example of how to use the package in your code:

```javascript
const PicScout = require('picscout').default;

(async () => {
  const res = await PicScout.search('cats');
  console.log(res);
})();
```

Output:

```
[
    {
        "url": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juvenile_Ragdoll.jpg",
        "width": 3336,
        "height": 3000
    },
    {
        "url": "https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg",
        "width": 3640,
        "height": 2226
    },
    {
        "url": "https://cdn.britannica.com/39/7139-050-A88818BB/Himalayan-chocolate-point.jpg",
        "width": 930,
        "height": 620
    }
]
```

**Note: The returned URLs are not guaranteed to work 100% of the time, some of the URLs might be broken.**

### Additional Options

The `search` method of PicScout supports additional options for more control over the search behavior.

#### Search Engine Option

You can specify the search engine to be used by passing the `engine` option with the desired value, such as `'google'` or `'bing'`:

```javascript
const PicScout = require('picscout').default;

(async () => {
  const res = await PicScout.search('cats', { engine: 'bing' });
  console.log(res);
})();
```

In the above example, the search will be performed using the Bing search engine. The default engine is 'google'.

#### Safe Search Option

To enable safe search mode and filter out explicit content from the search results, you can pass the `safe` option as `true`:

```javascript
const PicScout = require('picscout').default;

(async () => {
  const res = await PicScout.search('cats', { safe: true });
  console.log(res);
})();
```

In the above example, the search results will only include images considered safe for all audiences.

#### Additional Query Parameters Option

You can also include additional query parameters in the search request by using the `additionalQueryParams` option. It accepts a `URLSearchParams` instance:

```javascript
const PicScout = require('picscout').default;

(async () => {
  const additionalParams = new URLSearchParams();
  additionalParams.set('testparam', 'test');

  // Will call: http://images.google.com/search?tbm=isch&q=cats&testparam=test
  const res = await PicScout.search('cats', {
    additionalQueryParams: additionalParams,
  });
  console.log(res);
})();
```

In the above example, the search request will include an additional query parameter `testparam` with the value `'test'`. You can customize the additional query parameters as needed.

#### Global Parameters

The PicScout instance allows you to define some of the parameters globally, which will be used as defaults for the `search` method. However, if you specify a parameter in the method call, it will take precedence over the global value. Here are the available global parameters:

- `userAgent` (if not defined, a random one will be generated for each call)
- `safe` (default: `false`)
- `engine` (default: `'google'`)

For example, to set the global `safe` parameter to `true` and the `engine` parameter to `'bing'`, you can do the following:

```javascript
const PicScout = require('picscout').default;

PicScout.safe = true;
PicScout.engine = 'bing';

(async () => {
  const res = await PicScout.search('cats');
  console.log(res);
})();
```

In the above example, the search will be performed with safe search enabled and using the Bing search engine. If you pass a different value for any of these parameters in the method call, it will override the global setting.

## Acknowledgments

This package started off based on the [g-i-s](https://github.com/jimkang/g-i-s) package by Jim Kang. Please check it out as well.
