import { HttpError, SvelteKitError } from '../runtime/control.js';

/**
 * @param {unknown} err
 * @return {Error}
 */
export function coalesce_to_error(err) {
	return err instanceof Error ||
		(err && /** @type {any} */ (err).name && /** @type {any} */ (err).message)
		? /** @type {Error} */ (err)
		: new Error(JSON.stringify(err));
}

/**
 * This is an identity function that exists to make TypeScript less
 * paranoid about people throwing things that aren't errors, which
 * frankly is not something we should care about
 * @param {unknown} error
 */
export function normalize_error(error) {
	return /** @type {import('../runtime/control.js').Redirect | HttpError | SvelteKitError | Error} */ (
		error
	);
}

/**
 * @param {unknown} error
 * @returns {number}
 */
export function get_status(error) {
	if(error instanceof HttpError || error instanceof SvelteKitError)
		return error.status;

	if(error instanceof Object && 'status' in error && typeof error.status === 'number')
		return error.status;

	return 500;
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function get_message(error) {
	if(error instanceof SvelteKitError)
		return error.text;

	if(error instanceof Object && 'error' in error)
		error = error.error;
	
	if(error instanceof Object && 'message' in error && typeof error.message === 'string')
		return error.message;

	return 'Internal Error';
}
