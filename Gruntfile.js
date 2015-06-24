module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-git-authors');

  grunt.initConfig({

    authors: {
      prior: [
        "Ward Cunningham <ward@c2.com>",
        "Nick Niemeir <nick.niemeir@gmail.com>"
      ]
    },

    browserify: {
      packageClient: {
        src: ['client/chart.coffee'],
        dest: 'client/chart.js',
        options: {
          transform: ['coffeeify'],
          browserifyOptions: {
            extensions: ".coffee"
          }
        }
      }
    },

    watch: {
      all: {
        files: ['client/*.coffee'],
        tasks: ['browserify']
      }
    }
  });



  grunt.registerTask('build', ['browserify']);
  grunt.registerTask('default', ['build']);

};
