function getUptime() {
    const duration = process.uptime();
    const seconds = Math.floor(duration % 60);
    const minutes = Math.floor((duration / 60) % 60);
    const hours = Math.floor((duration / (60 * 60)) % 24);
    return `_*Uptime: ${hours.toString().padStart(2, "0")} hours ${minutes.toString().padStart(2, "0")} minutes ${seconds.toString().padStart(2, "0")} seconds*_`;
}

async function Runtime(date) { 
    const deployedTime = new Date(date);
    const currentTime = new Date();
    const runtimeMilliseconds = currentTime - deployedTime;
    const days = Math.floor(runtimeMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((runtimeMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((runtimeMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((runtimeMilliseconds % (1000 * 60)) / 1000);
    return `_*Runtime: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds....*_`
}

function secondsToHms(d) {
	d = Number(d);
	let h = Math.floor(d / 3600);
	let m = Math.floor(d % 3600 / 60);
	let s = Math.floor(d % 3600 % 60);
	let hDisplay = h > 0 ? h + (h == 1 ? " HOURS, " : " HOURS, ") : "";
	let mDisplay = m > 0 ? m + (m == 1 ? " MINUTE, " : " MINUTE, ") : "";
	let sDisplay = s > 0 ? s + (s == 1 ? " SECOND, " : " SECOND") : "";
	return hDisplay + mDisplay + sDisplay;
};

function timeConvert(time) {
  time = time.toString ().match (/^([01]\d|2[0-3])( )([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) { 
     time = time.slice (1); 
     time[5] = +time[0] < 12 ? ' AM' : ' PM';
     time[0] = +time[0] % 12 || 12; 
  };
  return time.join(''). replace(" ",":");
}

module.exports = {
  getUptime,
  Runtime,
  secondsToHms,
  timeConvert
}
