import merge from 'lodash/merge';

const mandatory = () => {
	return Promise.reject(new Error('Fetch API Missing parameter!'));
};

const { API_URL } = process.env;

const getApi = async ({ url, options, params } = mandatory(), cb = f => f) => {
	try {
		const defaultOptions = {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const opts = merge(defaultOptions, options);

		let uri = API_URL + url;

		if (params && Object.keys(params).length > 0) {
			if (opts && opts.method === 'GET') {
				uri += '?' + new URLSearchParams(params);
				console.log(uri);
			}
		}

		if (process.env.NODE_ENV !== 'production') {
			console.log('Call API: url, options, params', uri, options, params);
		}

		const response = await fetch(uri, opts);
		const data = await response.json();

		cb(null, data);
		return data;
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Call API Error: ', err);
		}
		cb(err);
		return Promise.reject(err);
	}
};

const postApi = async ({ url, options, params } = mandatory(), cb = f => f) => {
	try {
		const defaultOptions = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const opts = merge(defaultOptions, options);

		const uri = API_URL + url;
		console.log(API_URL);

		if (params && Object.keys(params).length > 0) {
			opts.body = JSON.stringify(params);
		}

		console.log(process.env.NODE_ENV);
		if (process.env.NODE_ENV !== 'production') {
			console.log('Post API: url, options, params', uri, options, params);
		}

		console.log(uri);
		const response = await fetch(uri, opts);
		console.log(response);
		const data = await response.json();

		cb(null, data);
		return data;
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Call API Error: ', err);
		}
		cb(err);
		return Promise.reject(err);
	}
};

const patchApi = async ({ url, options, params } = mandatory(), cb = f => f) => {
	try {
		const defaultOptions = {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const opts = merge(defaultOptions, options);

		const uri = API_URL + url;
		console.log(API_URL);

		if (params && Object.keys(params).length > 0) {
			opts.body = JSON.stringify(params);
		}

		console.log(process.env.NODE_ENV);
		if (process.env.NODE_ENV !== 'production') {
			console.log('Patch API: url, options, params', uri, options, params);
		}

		console.log(uri);
		const response = await fetch(uri, opts);
		console.log(response);
		const data = await response.json();

		cb(null, data);
		return data;
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Call API Error: ', err);
		}

		cb(err);
		return Promise.reject(err);
	}
};

const deleteApi = async ({ url, options, params } = mandatory(), cb = f => f) => {
	try {
		const defaultOptions = {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		const opts = merge(defaultOptions, options);

		let uri = API_URL + url;
		console.log(API_URL);

		if (params && Object.keys(params).length > 0) {
			if (opts && opts.method === 'GET') {
				uri += '?' + new URLSearchParams(params);
				console.log(uri);
			}
		}

		console.log(process.env.NODE_ENV);
		if (process.env.NODE_ENV !== 'production') {
			console.log('Post API: url, options, params', uri, options, params);
		}

		console.log(uri);
		const response = await fetch(uri, opts);
		console.log(response);
		const data = await response.json();

		cb(null, data);
		return response;
	} catch (err) {
		if (process.env.NODE_ENV !== 'production') {
			console.error('Call API Error: ', err);
		}

		cb(err);
		return Promise.reject(err);
	}
};
// export { getApi, postApi };
export { getApi, postApi, patchApi, deleteApi };
