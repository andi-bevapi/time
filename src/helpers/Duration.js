import moment from "moment";

export default class Duration {
    static durationAsHours = (endDate, startDate) => {
        const duration = moment.duration(moment(endDate).diff(moment(startDate)))
        return parseFloat(duration.asHours().toFixed(2));
    }
    static durationAsHoursAndMinsString = (endDate, startDate) => {
        let duration = moment.duration(moment(endDate).diff(moment(startDate)));
        return `${duration.hours() > 0 ? duration.hours() + 'h' : ''} ${duration.minutes() > 0 ? duration.minutes() + 'min' : ''}`;
    }
    static durationAsHoursAndMinsObject= (endDate, startDate) => {
        let duration = moment.duration(moment(endDate).diff(moment(startDate)))
        return {
            hours: duration.hours(),
            minutes: duration.minutes()
        };
    }
    static durationAsHoursAndMinsWithBreakString = (endDate, startDate, breaks) => {
        let duration = moment.duration(moment(endDate).diff(moment(startDate)));
        if(breaks) {
            duration = duration.add((-1 * breaks), 'minute');
        }
        return `${duration.hours() > 0 ? duration.hours() + 'h' : ''} ${duration.minutes() > 0 ? duration.minutes() + 'min' : ''}`;
    }
}
