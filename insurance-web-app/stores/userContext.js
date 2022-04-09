import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const UserContext = createContext({
	user: null,
	login: () => {},
});

export const UserContextProvider = ({ children }) => {
	const router = useRouter();

	const users = [
		{
			name: 'Leonard Hofstadter',
			role: 'broker',
			color: '#87d068',
		},
		{
			name: 'Sheldon Cooper',
			role: 'bank',
			color: '#8193E7',
		},
		{
			name: 'Rajesh Koothrappali',
			role: 'borrower',
			color: '#F3D377',
		},
		{
			name: 'Howard Wolowitz',
			role: 'insurance',
			color: '#CCDAD5',
		},
	];

	const [user, setUser] = useState(users[3]);

	useEffect(() => {
		if (user.role === 'broker') {
			router.push('/broker/request-policy');
		} else if (user.role === 'bank') {
			router.push('/common/policies');
		} else if (user.role === 'borrower') {
			router.push('/common/policies');
		} else if (user.role === 'insurance') {
			router.push('/common/policies');
		}
	}, [user]); // useEffect will triggered every time user state change.

	const login = (role) => {
		if (role === 'broker') {
			setUser(users[0]);
		} else if (role === 'bank') {
			setUser(users[1]);
		} else if (role === 'borrower') {
			setUser(users[2]);
		} else if (role === 'insurance') {
			setUser(users[3]);
		}
	};

	const context = { user, login };

	return (
		<UserContext.Provider value={context}>
			{children}
		</UserContext.Provider>
	);
};

export default UserContext;
