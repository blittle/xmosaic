importScripts('serviceworker-cache-polyfill.js');
importScripts('service-composer.js');

serviceComposer.compose([
  {
    name: 'images',
    matcher: 'https://www.apod.io/images', // Regex or string, the string needs to match the beginning of the request URL
    version: 1,
    type: serviceComposer.types.CACHE_ALWAYS
  },
  {
    name: 'others',
    version: 1,
    type: serviceComposer.types.CACHE_OFFLINE,
    customEvaluator: function(response, cache, event, config) {
      if(response.status < 400) {
        return new Promise(function(resolve, reject) {
          if(event.request.url.indexOf('page=') > -1) {
            prefetchImages(response.clone());
          }
          cache.put(event.request, response.clone());
        });
      }
    }
  }
]);

function prefetchImages(response) {
  response.json().then(function(json) {
    var urls = [];
    json.forEach(function(obj) {
      urls.push(obj.localImages.medPath);
    });

    caches.open('images-1').then(function(cache) {
      cache.addAll(urls);
    });
  });
}
