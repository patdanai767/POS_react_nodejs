import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import * as dayjs from "dayjs";

function ReportSumSalePerMonth() {
    const [years, setYears] = useState(() => {
        let arr = [];
        let d = new Date();
        let currentYear = d.getFullYear();
        let lastYear = currentYear - 5;

        for (let i = lastYear; i <= currentYear; i++) arr.push(i);
        return arr;
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear();
    });
    const [results, setResults] = useState([]);
    const [arrMonths, setArrMonths] = useState(() => {
        return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ]
    });

    useEffect(() => {
        
    }, []);

    const handleShowReport = async () => {
        try {
            const payload = {
                year: selectedYear
            }
            await axios.post(config.api_path + '/changePackage/reportSumSalePerMonth',payload , config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setResults(res.data.results);
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    const [selectedMonth, setSelectedMonth] = useState({});


    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title h5">Report monthly income</div>
                    </div>
                    <div className="card-body">
                        <div className="input-group">
                            <span className="input-group-text">Year</span>
                            <select onChange={e => setSelectedYear(e.target.value)} value={selectedYear} className="form-control">
                                {years.map(item =>
                                    <option value={item}>{item}</option>
                                )}
                            </select>
                            <button onClick={handleShowReport} className="btn btn-primary">
                                <i className="fa fa-check me-2" />
                                Report
                            </button>
                        </div>

                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Month</th>
                                    <th width='200px' className="text-end">Sum balance</th>
                                    <th width='200px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                { results.length > 0 ? results.map(item => 
                                <tr>
                                    <td>{arrMonths[item.month-1]}</td>
                                    <td className="text-end">{item.sum.toLocaleString('th-TH')}</td>
                                    <td className="text-center">
                                        <button data-bs-toggle='modal' data-bs-target='#modalInfo' onClick={e => setSelectedMonth(item)} className="btn btn-success">
                                            <i className="fa fa-file-alt me-2"/>
                                            Report
                                        </button>
                                    </td>
                                </tr>
                                ):''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalInfo' title='Info' modalSize='modal-lg'>
                <table className="mt-3 table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Date register</th>
                            <th>Date paid</th>
                            <th>Member</th>
                            <th>Package</th>
                            <th className="text-end">Cost per month</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMonth.results != undefined ? selectedMonth.results.map(item =>
                        <tr>
                            <td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</td>
                            <td>{dayjs(item.payDate).format('DD/MM/YYYY')} {item.payHour}:0{item.payMinute}</td>
                            <td>{item.member.name}</td>
                            <td>{item.package.name}</td>
                            <td className="text-end">{parseInt(item.package.price).toLocaleString('th-TH')}</td>
                        </tr>
                        ):''}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}

export default ReportSumSalePerMonth;