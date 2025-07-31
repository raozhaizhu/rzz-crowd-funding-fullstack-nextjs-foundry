/**
 * 用于得到当前时间戳
 * @returns 返回秒数 （而不是毫秒）
 */
export const getCurrentTimeStamp = () => Math.floor(Date.now() / 1000);

console.log("*** getCurrentTimeStamp:", getCurrentTimeStamp(), "***");
