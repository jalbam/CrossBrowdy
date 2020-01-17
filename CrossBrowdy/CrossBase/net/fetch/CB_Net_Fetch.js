/**
 * @file [Fetch API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API} management. Contains the {@link CB_Net.Fetch} static class.
 *  @author Joan Alba Maldonado <workindalian@gmail.com>
 *  @license Creative Commons Attribution 4.0 International. See more at {@link https://crossbrowdy.com/about#what_is_the_crossbrowdy_copyright_and_license}.
 */


if (typeof(CB_Net) === "undefined") { var CB_Net = function() { return CB_Net; }; }


/**
 * Static class to manage things related to the [Fetch API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API}. It will return itself if it is tried to be instantiated.
 * @namespace
 */
CB_Net.Fetch = function() { return CB_Net.Fetch; };
{
	CB_Net.Fetch.initialized = false; //It will tells whether the object has been initialized or not.
	
	
	//Initializes all values:
	CB_Net.Fetch.init = function()
	{
		if (CB_Net.Fetch.initialized) { return CB_Net.Fetch; }

		//The object has been initialized:
		CB_Net.Fetch.initialized = true;

		//TODO.

		return CB_Net.Fetch;
	}

	
	/**
	 * Function that points to the [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch} method. If the [Fetch API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API} is not supported natively, the [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch} function will be a polyfill.
	 *  @function
	 *  @param {string|Request} resource - First parameter of the [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch} method.
	 *  @param {Object} [init] - Second parameter of the [fetch]{@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch} method.
	 *  @returns {Promise}
	 */
	CB_Net.Fetch.get = function() { return fetch.apply(CB_this || window, arguments); }; //Points to the "fetch" function.
	
}