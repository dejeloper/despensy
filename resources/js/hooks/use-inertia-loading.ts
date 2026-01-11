import {router} from '@inertiajs/react';
import {useEffect, useState} from 'react';

export function useInertiaLoading() {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		let loadingTimeout: NodeJS.Timeout;

		const handleStart = () => {
			loadingTimeout = setTimeout(() => {
				setIsLoading(true);
			}, 300);
		};

		const handleFinish = () => {
			clearTimeout(loadingTimeout);
			setIsLoading(false);
		};

		const removeStartListener = router.on('start', handleStart);
		const removeFinishListener = router.on('finish', handleFinish);

		return () => {
			clearTimeout(loadingTimeout);
			removeStartListener();
			removeFinishListener();
		};
	}, []);

	return isLoading;
}
