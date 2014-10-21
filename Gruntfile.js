module.exports = function(grunt) {

	grunt.initConfig({
		nodemon : {
			dev : {
				script : 'server.js',
				options : {
					file: 'server.js',
					watchedFolders : ['app'],
					env : {
						PORT : '3000'
					}
				}
			}
		},

		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: './public/scss',
					src: ['**/*.scss'],
					dest: './public/css/',
					ext: '.css'
				}]
			}
		},

		compass: {
			dist: {
				options: {
					sassDir: './public/scss',
					cssDir: './public/css'
				}
			}
		},

		watch: {
			scripts: {
				files: ['/public/scss/**/*.scss'],
				tasks: ['sass'],
				options: {
					spawn: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');

	grunt.registerTask('default', ['sass']);
	grunt.registerTask('debug', ['watch', 'nodemon']);
	grunt.registerTask('compile', ['compass']);
	grunt.registerTask('watch', ['sass', 'watch']);

};
