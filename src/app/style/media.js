const sizes = {
	LARGE: 'large',
	MEDIUM: 'medium',
	SMALL: 'small'
};

export default sizes;

export const namedKeys = {
	[sizes.LARGE]: '@media (min-width: 75rem)',
	[sizes.MEDIUM]: '@media (min-width: 37.5rem)',
	[sizes.SMALL]: '@media (max-width: 37.4rem)'
};
