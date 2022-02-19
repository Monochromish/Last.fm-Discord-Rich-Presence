module.exports = {
	mode: 'jit',
	purge: ['./*.html'],
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['dracula']
	}
};
