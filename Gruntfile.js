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
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'server/', src: ['**'], dest: 'dist/nodeapp/server/'},
                    {expand: true, src: ['*.js*'], dest: 'dist/nodeapp/', filter: 'isFile'},
                    {expand: true, src: ['*.conf'], dest: 'dist/nodeapp/', filter: 'isFile'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('dist', ['clean', 'compress', 'copy']);

    grunt.registerTask('default', ['dist']);

};