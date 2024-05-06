import Template from "../components/Template";
import axios from "axios";
import { useState, useEffect } from 'react';
import config from "../config";
import Swal from "sweetalert2";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";

function ReportSumSalePerDay() {

    const [years, setYears] = useState(() => {
        let arr=[];
        let d = new Date();
        let currentYear = d.getFullYear();
        let lastYear = currentYear-5;

        for(let i = lastYear; i <= currentYear;i++){
            arr.push(i);
        }

        return arr;
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        return new Date().getFullYear();
    });
    const [arrMonth, setArrMonth] = useState(() => {
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
        ];
    });
    const [selectedMonth, setSelectedMonth] = useState(() => {
        return new Date().getMonth() + 1;
    });

    const [results, setResults] = useState([]);

    const handleShowReport = async() => {
        try{
            const payload = {
                month: selectedMonth,
                year: selectedYear
            }

            await axios.post(config.api_path + '/changePackage/reportSumSalePerDay', payload, config.headers()).then(res => {
                if(res.data.message === 'success'){
                    setResults(res.data.results);
                }
            }).catch(err => {
                throw err.response.data;
            })
        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.meesage,
                icon: 'error'
            })
        }
    };

    const [selectedDay, setSelectedDay] = useState({});

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title h5">
                            Report daily income
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <div className="input-group">
                                    <span className="input-group-text">Year</span>
                                    <select onChange={e => setSelectedYear(e.target.value)} value={selectedYear} className="form-control">
                                        {years.map (item => 
                                            <option value={item}>
                                                {item}
                                            </option>
                                            )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="input-group">
                                    <span className="input-group-text">Month</span>
                                    <select onChange={e => setSelectedMonth(e.target.value)} value={selectedMonth} className="form-control">
                                        {arrMonth.map((item,index) =>
                                            <option value={index + 1}>{item}</option>
                                            )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-6">
                                <button onClick={handleShowReport} className="btn btn-primary">
                                    <i className="fa fa-check me-2"/>
                                    Report
                                </button>
                            </div>
                        </div>
                        <table className="table table-bordered table-striped mt-3">
                            <thead>
                                <tr>
                                    <th width='100px'>DAY</th>
                                    <th className="text-end">All income</th>
                                    <th width='150px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? results.map(item => 
                                <tr>
                                    <td>{item.day}</td>
                                    <td className="text-end">{parseInt(item.sum).toLocaleString('th-TH')}</td>
                                    <td className="text-center">
                                        <button onClick={e => setSelectedDay(item)} data-bs-toggle='modal' data-bs-target='#modalInfo' className="btn btn-success">
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
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Day register</th>
                            <th>Day paid</th>
                            <th>Member</th>
                            <th>Package</th>
                            <th className="text-end">Cost per month</th>
                        </tr>
                    </thead>
                    <tbody>
                        { selectedDay.results != undefined ? selectedDay.results.map(item => 
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

export default ReportSumSalePerDay;