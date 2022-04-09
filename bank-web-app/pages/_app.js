import React from 'react';
import '../styles/globals.css';

import BasicLayout from '../components/BasicLayout';
import { UserContextProvider } from '../stores/userContext';
import { SmartContractContextProvider } from '../stores/smartContractContext';

function MyApp({ Component, pageProps }) {
	return (
		<UserContextProvider>
			<SmartContractContextProvider>
				<BasicLayout>
					<Component {...pageProps} />
				</BasicLayout>
			</SmartContractContextProvider>
		</UserContextProvider>
	);
}

export default MyApp;
