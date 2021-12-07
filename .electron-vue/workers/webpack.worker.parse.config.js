const WebpackWorker = require('../webpack.worker.config');
const option = {
    name: 'excel-parse'
}
const configProvider = new WebpackWorker(option);
module.exports = configProvider.exportConfig();