/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with DocumentHeader source code.
 *
 * The TYPO3 project - inspiring people to share!
 */

/**
 * Module: TYPO3/CMS/Backend/Icons
 * Uses the icon API of the core to fetch icons via AJAX.
 */
define(['jquery'], function($) {
	'use strict';

	/**
	 *
	 * @type {{cache: {}, sizes: {small: string, default: string, large: string, overlay: string}, states: {default: string, disabled: string}}}
	 * @exports TYPO3/CMS/Backend/Icons
	 */
	var Icons = {
		cache: {},
		sizes: {
			small: 'small',
			default: 'default',
			large: 'large',
			overlay: 'overlay'
		},
		states: {
			default: 'default',
			disabled: 'disabled'
		}
	};

	/**
	 * Get the icon by its identifier.
	 *
	 * @param {String} identifier
	 * @param {String} size
	 * @param {String} overlayIdentifier
	 * @param {String} state
	 * @return {Promise<Array>}
	 */
	Icons.getIcon = function(identifier, size, overlayIdentifier, state) {
		return $.when(Icons.fetch(identifier, size, overlayIdentifier, state));
	};

	/**
	 * Performs the AJAX request to fetch the icon.
	 *
	 * @param {string} identifier
	 * @param {string} size
	 * @param {string} overlayIdentifier
	 * @param {string} state
	 * @return {String|Promise}
	 * @private
	 */
	Icons.fetch = function(identifier, size, overlayIdentifier, state) {
		/**
		 * Icon keys:
		 *
		 * 0: identifier
		 * 1: size
		 * 2: overlayIdentifier
		 * 3: state
		 */
		size = size || Icons.sizes.default;
		state = state || Icons.states.default;

		var icon = [identifier, size, overlayIdentifier, state],
			cacheIdentifier = icon.join('_');

		if (Icons.isCached(cacheIdentifier)) {
			return Icons.getFromCache(cacheIdentifier);
		}

		return $.ajax({
			url: TYPO3.settings.ajaxUrls['icons'],
			dataType: 'html',
			data: {
				icon: JSON.stringify(icon)
			},
			success: function(markup) {
				Icons.putInCache(cacheIdentifier, markup);
			}
		});
	};

	/**
	 * Check whether icon was fetched already
	 *
	 * @param {String} cacheIdentifier
	 * @returns {Boolean}
	 * @private
	 */
	Icons.isCached = function(cacheIdentifier) {
		return typeof Icons.cache[cacheIdentifier] !== 'undefined';
	};

	/**
	 * Get icon from cache
	 *
	 * @param {String} cacheIdentifier
	 * @returns {String}
	 * @private
	 */
	Icons.getFromCache = function(cacheIdentifier) {
		return Icons.cache[cacheIdentifier];
	};

	/**
	 * Put icon into cache
	 *
	 * @param {String} cacheIdentifier
	 * @param {Object} markup
	 * @private
	 */
	Icons.putInCache = function(cacheIdentifier, markup) {
		Icons.cache[cacheIdentifier] = markup;
	};

	return Icons;
});
