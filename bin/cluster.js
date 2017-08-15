var server = require('./www');
var cluster = require('cluster');
var os = require('os');

// get CPU num
var numCPUs = os.cpus().length;
var workers = {};

if (cluster.isMaster) {
	cluster.on('death', function (worker) {
		// renew a work process
		delete workers[worker.pid];
		worker = cluster.fork();
		workers[worker.pid] = worker;
	});


	for (var i = 0; i < numCPUs; i++) {
		var worker = cluster.fork();
		workers[worker.pid] = worker;
	}
} else {
	server.listen(3000);
}


process.on('SIGTERM', function () {
	for (var pid in workers) {
		process.kill(pid);
	}
	process.exit(0);
});