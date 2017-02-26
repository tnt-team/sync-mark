module.exports = function(grunt) {

    grunt.config.init({
        clean: {
            build: ['build'],
            release: ['dist']
        },
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: 'dist/syncmark.xpi'
                },
                expand: true,
                cwd: 'extension/',
                src: ['**/*'],
                dest: '/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('dist', ['clean', 'compress']);

    grunt.registerTask('default', ['dist']);

};