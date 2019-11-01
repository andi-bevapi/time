/**
 * @description Manages window.storage
 * @returns storage objects
 * @class StorageManager
 */
class StorageManager {
	/**
   * @description Set or update given value in localStorage
   * @static
   * @returns Object
   * @memberof StorageManager
   */
	static set(key, value) {
		if(key && value) {
			window.localStorage.setItem(key, value);
			return {
				success: true,
				data: 'Storage has been set successfully.'
			};
		}

		return {
			error: true,
			data: 'Storage was not set. Storage key and value is required!'
		};
	}

	/**
   * @description Set or update given value in sessionStorage, used to not remember user after closing opened tab.
   * @static
   * @returns Object
   * @memberof StorageManager
   */
	static setToSession(key, value) {
		if (key && value) {
			window.sessionStorage.setItem(key, value);
			return {
				success: true,
				data: 'Storage has been set successfully.'
			};
		}

		return {
			error: true,
			data: 'Storage was not set. Storage key and value is required!'
		};
	}

	/**
   * @description Fetch data from localStorage
   * @static
   * @returns Object
   * @memberof StorageManager
   */
	static get(key) {
		if(key) {
			return window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
		}

		return {
			error: true,
			data: 'Storage key is required!'
		};
	}

	/**
   * @description Clear only one value from localStorage
   * @static
   * @returns Object
   * @memberof StorageManager
   */
	static clearOne(key) {
		if(key) {
			window.localStorage.removeItem(key) || window.sessionStorage.removeItem(key);
		}

		return 'Storage key is required!';
	}

	/**
   * @description Clear all values from localStorage
   * @static
   * @returns Object
   * @memberof StorageManager
   */
	static clearAll() {
		window.localStorage.clear();
		window.sessionStorage.clear();
	}
}

export default StorageManager;
