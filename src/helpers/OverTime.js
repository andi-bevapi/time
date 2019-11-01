import moment from 'moment';

export default class OverTime {
    constructor(){
        this.californiaLocations = ['701','702','703','704','705','706','707','708','711','712','713','714','715','716','717','718','719','720','721','722','723','724','725','727','730','732','733','734','750','751','752'];
        this.over44HoursPerWeek = ['852', '854', '860'];
        this.rules = this.setDefaultRules()
    }
    isOnCalifornia(locationCode) {
      return this.californiaLocations.includes(locationCode);
    }
    isOnCanada(locationCode) {
      return this.over44HoursPerWeek.includes(locationCode);
    }
    isSameDay(m1, m2){
        return m1.date() === m2 .date() && m1.month() === m2.month() && m1.year() === m2.year()
    }
    mapSchedules(schedules) {
        const mapSchedules = {};
        schedules.forEach((sc)=>{
            const startDate = moment(sc.data ?sc.data.startDate : sc.startDate).format('MM-DD-YYYY').toString();
            if(!mapSchedules[startDate]){
                mapSchedules[startDate] =[];
            }
            mapSchedules[startDate].push(sc.data ? sc.data : sc);
        });
        return mapSchedules;
    }
    getSchedulesByWeek(startDate, endDate, schedules, locationCode, isHourly){
        const hrs = {
            total: {
                hrs: 0,
                min: 0,
            },
            ovt: {
                hrs: 0,
                min: 0
            }
        };
        const map = this.mapSchedules(schedules);
        const weeks = [];
        let weekDays = [];
        let startDay = moment(startDate).weekday();
        if( startDay > 0){
            startDay = startDay * -1;
        } else {
            startDay = -1;
        }
        let endDay = moment(endDate).weekday();
        if( endDay > 0){
            endDay = 7 - endDay;
        } else {
            endDay = 0;
        }
        const currDate = moment(startDate).add(startDay, 'day').startOf('day');
        const lastDate = moment(endDate).add(endDay, 'day').startOf('day');

        while(currDate.add(1, 'days').diff(lastDate) <= 0) {
            const newDate = currDate.clone().startOf('day');
            weekDays.push({
                day: newDate.weekday(),
                date: newDate.format('MM-DD-YYYY').toString()
            });
            if(weekDays.length === 7){
                weeks.push(weekDays);
                weekDays = [];
            }
        }
        weeks.forEach( week => {
            const weekHrs = [];
            week.forEach(day => {
                let hrs = 0;
                let min = 0;
                if(map[day.date] && map[day.date].length > 0){
                    map[day.date].forEach(sc => {
                        const startDate = moment(sc.startDate);
                        startDate.second() || startDate.millisecond() ?
                          startDate.add(1, "minute").startOf("minute") :
                          startDate.startOf("minute")
                        ;
                        const endDate = moment(sc.endDate);
                        endDate.second() || endDate.millisecond() ?
                          endDate.add(1, "minute").startOf("minute") :
                          endDate.startOf("minute")
                        ;
                        let duration = moment.duration(moment(endDate).diff(moment(startDate)));
                        if(sc.breaks) {
                            duration = duration.add((-1 * sc.breaks), 'minute');
                        }
                        hrs += duration.hours();
                        min += duration.minutes();
                    });
                    weekHrs.push({
                        hrs,
                        min,
                        day: day.day
                    });
                } else {
                    weekHrs.push({
                        hrs,
                        min,
                        day: day.day
                    });
                }
            });
            const weekHours = this.rules.weekOverTime(weekHrs,locationCode, isHourly);
            hrs.total.hrs += weekHours.time.hrs;
            hrs.total.min += weekHours.time.min;
            if(hrs.total.min >= 60) {
                hrs.total.hrs += 1;
                hrs.total.min -= 60;
            }
            hrs.ovt.hrs += weekHours.ovt.hrs;
            hrs.ovt.min += weekHours.ovt.min;
            if(hrs.ovt.min >= 60) {
                hrs.ovt.hrs += 1;
                hrs.ovt.min -= 60;
            }
        });
        if(hrs.total.hrs > 40 || (hrs.total.hrs === 40 && hrs.total.min > 0)){
            if(this.over44HoursPerWeek.includes(locationCode)){
                if(hrs.total.hrs > 44 || (hrs.total.hrs === 44 && hrs.total.min > 0)){
                    hrs.ovt.hrs += hrs.total.hrs - 44;
                    hrs.ovt.min += hrs.total.min;
                    hrs.total.hrs = 44;
                    hrs.total.min = 0;
                } else {
                    hrs.ovt.hrs += hrs.total.hrs - 40;
                    hrs.ovt.min += hrs.total.min;
                    hrs.total.hrs = 40;
                    hrs.total.min = 0;
                }
            }
        }
        return hrs;
    };
    getScheduleByDay(schedules, locationCode, isHourly) {
        const dailyHrs = {
            hrs: 0,
            min: 0,
        };
        schedules.forEach(sc => {
            const startDate = moment(sc.data ?sc.data.startDate : sc.startDate);
            startDate.second() || startDate.millisecond() ?
              startDate.add(1, "minute").startOf("minute") :
              startDate.startOf("minute")
            ;
            const endDate = moment(sc.data ?sc.data.endDate : sc.endDate);
            endDate.second() || endDate.millisecond() ?
              endDate.add(1, "minute").startOf("minute") :
              endDate.startOf("minute")
            ;
            let duration = moment.duration(moment(endDate).diff(moment(startDate)));
            if((sc.data && sc.data.breaks) || sc.breaks) {
                duration = duration.add((-1 * (sc.data ? sc.data.breaks: sc.breaks)), 'minute');
            }
            dailyHrs.hrs += duration.hours();
            dailyHrs.min += duration.minutes();
        });
        const hrs = {
            total: {
                hrs: 0,
                min: 0,
            },
            ovt: {
                hrs: 0,
                min: 0
            }
        };
        if(dailyHrs.hrs > 0 || dailyHrs.min > 0) {
            const dailyHours = this.rules.dailyOverTime(dailyHrs, locationCode, isHourly);
            console.log(dailyHours);
            hrs.total.hrs += dailyHours.time.hrs;
            hrs.total.min += dailyHours.time.min;
            if(hrs.total.min >= 60) {
                hrs.total.hrs += 1;
                hrs.total.min -= 60;
            }
            hrs.ovt.hrs += dailyHours.ovt.hrs;
            hrs.ovt.min += dailyHours.ovt.min;
            if(hrs.ovt.min >= 60) {
                hrs.ovt.hrs += 1;
                hrs.ovt.min -= 60;
            }
        }
        return hrs;
    }
    setDefaultRules() {
        return {
            dailyOverTime: (dailyTime, locationCode, isHourly) => {
                const ovt = {
                    hrs: 0,
                    min: 0
                };
                if((this.isOnCalifornia(locationCode) || '860' === locationCode) && isHourly){
                    if(dailyTime.hrs > 8 || (dailyTime.hrs === 8 && dailyTime.min > 0)) {
                        ovt.hrs = dailyTime.hrs - 8;
                        ovt.min = dailyTime.min;
                        dailyTime.hrs = 8;
                        dailyTime.min = 0;
                    }
                }
                return {
                    time: dailyTime,
                    ovt
                }
            },
            weekOverTime: (weekTime, locationCode, isHourly) => {
                const ovt = {
                    hrs: 0,
                    min: 0
                };
                const total = {
                    hrs: 0,
                    min: 0,
                };
                // get once daily overTime for default locationCodes
                if((this.isOnCalifornia(locationCode) || '860' === locationCode) && isHourly){
                    weekTime = weekTime.map(dailyTime => {
                        const overTime = this.rules.dailyOverTime(dailyTime, locationCode, isHourly);
                        ovt.hrs += overTime.ovt.hrs;
                        ovt.min += overTime.ovt.min;
                        if(ovt.min >= 60) {
                            ovt.hrs += 1;
                            ovt.min -= 60;
                        }
                        dailyTime.hrs = overTime.time.hrs;
                        dailyTime.min = overTime.time.min;
                        if(dailyTime.min >= 60) {
                            dailyTime.hrs += 1;
                            dailyTime.min -= 60;
                        }
                        return dailyTime;

                    });

                    if(this.isOnCalifornia(locationCode) && weekTime.filter(dailyTime=> dailyTime.hrs> 0 || dailyTime.min > 0).length === 7){
                        weekTime = weekTime.map(dailyTime => {
                           if(dailyTime.day === 6) {
                               ovt.hrs += dailyTime.hrs;
                               ovt.min += dailyTime.min;
                               dailyTime.hrs = 0;
                               dailyTime.min = 0;
                               if(ovt.min >= 60) {
                                   ovt.hrs += 1;
                                   ovt.min -= 60;
                               }
                           }
                           total.hrs += dailyTime.hrs;
                           total.min += dailyTime.min;
                           if(total.min >= 60) {
                               total.hrs += 1;
                               total.min -= 60;
                           }
                           return dailyTime;
                       });
                    } else {
                        weekTime.forEach(dailyTime => {
                            total.hrs += dailyTime.hrs;
                            total.min += dailyTime.min;
                            if(total.min >= 60) {
                                total.hrs += 1;
                                total.min -= 60;
                            }
                        });
                    }
                    if(total.hrs > 40 || (total.hrs === 40 && total.min > 0)) {
                        ovt.hrs += total.hrs - 40;
                        ovt.min += total.min;
                        if(ovt.min >= 60) {
                            ovt.hrs += 1;
                            ovt.min -= 60;
                        }
                        total.hrs = 40;
                        total.min = 0;
                    }
                }
                else if((this.over44HoursPerWeek.includes(locationCode)) && isHourly){
                    weekTime.forEach(dailyTime => {
                        total.hrs += dailyTime.hrs;
                        total.min += dailyTime.min;
                        if(total.min >= 60) {
                            total.hrs += 1;
                            total.min -= 60;
                        }
                    });
                    if(total.hrs > 44 || (total.hrs === 44 && total.min > 0)) {
                        ovt.hrs += total.hrs - 44;
                        ovt.min += total.min;
                        if(ovt.min >= 60) {
                            ovt.hrs += 1;
                            ovt.min -= 60;
                        }
                        total.hrs = 44;
                        total.min = 0;
                    }
                }
                else {
                    weekTime.forEach(dailyTime => {
                        total.hrs += dailyTime.hrs;
                        total.min += dailyTime.min;
                        if(total.min >= 60) {
                            total.hrs += 1;
                            total.min -= 60;
                        }
                    });
                    if((total.hrs > 40 || (total.hrs === 40 && total.min > 0)) && isHourly) {
                        ovt.hrs += total.hrs - 40;
                        ovt.min += total.min;
                        if(ovt.min >= 60) {
                            ovt.hrs += 1;
                            ovt.min -= 60;
                        }
                        total.hrs = 40;
                        total.min = 0;
                    }
                }
                return {
                    time: total,
                    ovt: ovt
                }
            }
        };
    }

    calculateOverTime(schedules, startDate, endDate, locationCode, isHourly) {
        if(this.isSameDay(moment(startDate), moment(endDate))){
            console.log(isHourly);
            return this.getScheduleByDay(schedules, locationCode, isHourly);
        } else {
            return this.getSchedulesByWeek(startDate,endDate, schedules, locationCode, isHourly);
        }
    }
}
