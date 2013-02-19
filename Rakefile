require 'rake'

task :clean do
    rm_f Dir.glob("*~")
    rm_f Dir.glob("**/*~")
    sh "ls -G"
end

task :buildAndRun do
    sh "node app.js"
end

task :default => :run
