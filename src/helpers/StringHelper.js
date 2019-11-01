import moment from 'moment';
import React from "react";

export default class StringHelper {
    static currencyFormatter(currency) {
        return new Intl.NumberFormat('en-EN', {
            style: 'currency',
            currency: currency
        })
    }

    static dateFormat(date) {
        return moment(date).format('MM/DD/YYYY')
    }

    static getTime(date) {
        return moment(date).format('hh:mm A')
    }

    static formatPhone(phone) {
        phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        return phone;
    }

    static statusFormat(status) {
        if (status.type === 'Buffer') {
            return status.data[0] === 1 ? 'Active' : 'Terminated'
        } else {
            return status
        }
    }

    static formatScheduleStatus(status, object, data) {
        if(object === 'schedule') {
            switch (status) {
                case 'publish-schedule':
                    return (<span className="badge badge-success">Published</span>);
                case 'submit':
                    return (<span className="badge badge-success">Submitted</span>);
                case 'approved':
                    return (<span className="badge badge-success">Approved</span>);
                case 'delete-schedule':
                    return (<span className="badge badge-danger">Deleted</span>);
                case 'rejected':
                    return (<span className="badge badge-danger">Rejected</span>);
                case 'reject-schedule':
                    return (<span className="badge badge-danger">Rejected</span>);
                case 'update-schedule':
                    return (<span className="badge badge-info">Updated</span>);
                case 'submitted':
                    return (<span className="badge badge-warning">Submitted</span>);
                default:
                    return (<span className="badge badge-secondary">{status}</span>);
            }
        } else {
            const d = JSON.parse(data);
            switch (d.status) {
                case 'approved':
                    return (<span className="badge badge-success">Share Employee Approved</span>);
                case 'rejected':
                    return (<span className="badge badge-danger">Share Employee Rejected</span>);
                case 'deleted':
                    return (<span className="badge badge-danger">Share Employee Deleted</span>);
                case 'updated':
                    return (<span className="badge badge-info">Share Employee Updated</span>);
                case 'pending':
                    return (<span className="badge badge-warning">Pending share Employee</span>);
                case 'auto-reject':
                    return (<span className="badge badge-danger">Shared Employee Auto Rejected</span>);
                case 'end-working':
                    return (<span className="badge badge-pink">Shared Employee End Working</span>);
                case 'start-working':
                    return (<span className="badge badge-cyan">Shared Employee Start Working</span>);
                default:
                    return (<span className="badge badge-warning">Pending share Employee</span>);
            }
        }

    }

    static textTruncate(str, length, ending) {
        if (length == null) {
            length = 100;
        }
        if (ending == null) {
            ending = '...';
        }
        if (str.length > length) {
            return str.substring(0, length - ending.length) + ending;
        } else {
            return str;
        }
    };

    static formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
            const negativeSign = amount < 0 ? "-" : "";
            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;
            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    };

    static formatEmployeeShared(shared) {
        switch (shared) {
            case 1:
                return (<span className="badge badge-success">Shared</span>);
            case 2:
                return (<span className="badge badge-warning">Pending</span>);
            default:
                return (<span className="badge badge-secondary">My Employee</span>);
        }
    }
}
