# PicScout

[![codecov](https://codecov.io/gh/JMax45/picscout/branch/master/graph/badge.svg?token=6HK7W42XCV)](https://codecov.io/gh/JMax45/picscout)

PicScout is an NPM module that allows you to search for images using Google Image Search. It provides the same functionality as [g-i-s](https://github.com/jimkang/g-i-s) by Jim Kang, in fact the starting code is from their module.

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

**The returned URLs are not guaranteed to work 100% of the times, some of the URLs might be broken**

### Additional Options

The `search` method of PicScout supports additional options for more control over the search behavior.

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

## Acknowledgments

This package is based on the [g-i-s](https://github.com/jimkang/g-i-s) package by Jim Kang. Please check it out as well.
