// const cron = require('node-cron');
// var task = cron.schedule('* * * * *', () => {
//    console.log("osr")
// });
// task.start();

CronJob = require('cron').CronJob;

new CronJob('* * * * * *', function () {
   console.log("staring cron ==> " + new Date());
   testScheduler(new Date());
}, null, true);


let testScheduler = async (date) => {
   console.log(':: ' + date);
}