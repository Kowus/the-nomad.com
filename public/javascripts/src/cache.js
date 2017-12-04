/*
 * the-nomad.com ==> cache.js
 * Created By barnabasnomo on 12/4/17 at 3:52 AM
*/
var appCache = window.applicationCache;

/*switch (appCache.status) {
    case appCache.UNCACHED: // UNCACHED == 0
        return 'UNCACHED';
        break;
    case appCache.IDLE: // IDLE == 1
        return 'IDLE';
        break;
    case appCache.CHECKING: // CHECKING == 2
        return 'CHECKING';
        break;
    case appCache.DOWNLOADING: // DOWNLOADING == 3
        return 'DOWNLOADING';
        break;
    case appCache.UPDATEREADY:  // UPDATEREADY == 4
        return 'UPDATEREADY';
        break;
    case appCache.OBSOLETE: // OBSOLETE == 5
        return 'OBSOLETE';
        break;
    default:
        return 'UKNOWN CACHE STATUS';
        break;
};*/

// appCache.update(); // Attempt to update the user's cache.



if (appCache.status == window.applicationCache.UPDATEREADY) {
    appCache.swapCache();  // The fetch was successful, swap in the new cache.
}

window.addEventListener('load', function(e) {

    window.applicationCache.addEventListener('updateready', function(e) {
        if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
            // Browser downloaded a new app cache.
            if (confirm('A new version of this site is available. Load it?')) {
                window.location.reload();
            }
        } else {
            // Manifest didn't changed. Nothing new to server.
        }
    }, false);

}, false);


function handleCacheError(e) {
    alert('Error: Cache failed to update!');
}

// The manifest returns 404 or 410, the download failed,
// or the manifest changed while the download was in progress.
appCache.addEventListener('error', handleCacheError, false);