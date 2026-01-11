import {router} from '@inertiajs/react';
import {useEffect, useState} from 'react';

/**
 * Hook personalizado para detectar el estado de carga de las navegaciones de Inertia.
 * @returns {boolean} true cuando Inertia está navegando, false cuando termina.
 */
export function useInertiaLoading() {
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const handleStart = () => setIsLoading(true);
		const handleFinish = () => setIsLoading(false);

		const removeStartListener = router.on('start', handleStart);
		const removeFinishListener = router.on('finish', handleFinish);

		return () => {
			removeStartListener();
			removeFinishListener();
		};
	}, []);

	return isLoading;
}
