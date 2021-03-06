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
    onSuccess: function(response, cache, event, config) {
      if(event.request.url.indexOf('page=') > -1) {
        prefetchImages(response.clone());
      }
    }
  }
]);

function prefetchImages(response) {
  response.json().then(function(json) {
    caches.open('images-1').then(function(cache) {
      var urls = json.forEach(function(obj) {
        cache.match(obj.localImages.medPath)
        .catch(function() {
          cache.add(obj.localImages.medPath);
        })
      });
    });
  });
}
