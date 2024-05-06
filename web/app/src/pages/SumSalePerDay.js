import Template from "../components/Template";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function SumSalePerDay() {
    const [currentYear, setCurrentYear] = useState(() => {
        let myDate = new Date();
        return myDate.getFullYear();
    });
    const [arrYear, setArrYear] = useState(() => {
        let arr = [];
        let myDate = new Date();
        let currentYear = myDate.getFullYear();
        let beforeYear = currentYear - 5;

        for (let i = beforeYear; i <= currentYear; i++) {
            arr.push(i);
        }

        return arr;
    });

    const [currentMonth, setCurrentMonth] = useState(() => {
        let myDate = new Date();
        return myDate.getMonth()+1;
    });
    const [arrMonth, setArrMonth] = useState(() => {
        let arr = [
            {value: 1, label: 'January'},
            {value: 2, label: 'Febuary'},
            {value: 3, label: 'March'},
            {value: 4, label: 'April'},
            {value: 5, label: 'May'},
            {value: 6, label: 'June'},
            {value: 7, label: 'July'},
            {value: 8, label: 'August'},
            {value: 9, label: 'September'},
            {value: 10, label: 'October'},
            {value: 11, label: 'November'},
            {value: 12, label: 'December'}
        ]

        return arr;
    });

    const [billSales, setbillSales] = useState([]);
    const [currentBillSale, setCurrentBillSale] = useState({});
    const [billSaleDetails, setBillSaleDetails] = useState([]);

    useEffect(() => {
        handleShowReport();
    },[]);

    const handleShowReport = async() => {
        try{
            const path = config.api_path + '/billSale/listByYearAndMonth/' + currentYear + '/' + currentMonth;
            await axios.get(path, config.headers()).then(res => {
                if(res.data.message === 'success'){
                setbillSales(res.data.results);
                }
            }).catch(err => {
                throw err.response.data;
            })
        }catch(e){
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }


    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Report Bill per day</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-3">
                                <div className="input-group">
                                    <span className="input-group-text">Year</span>
                                    <select onChange={e => setCurrentYear(e.target.value)} value={currentYear} className="form-control">
                                        {arrYear.map(item =>
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
                                    <select onChange={e => setCurrentMonth(e.target.value)} value={currentMonth} className="form-control">
                                            {arrMonth.map(item => 
                                                <option value={item.value}>
                                                    {item.label}
                                                </option>
                                                )}
                                    </select>
                                </div>
                            </div>
                            <div className="col-6">
                                <button onClick={handleShowReport} className="btn btn-primary">
                                    <i className="fa fa-check me-2" />
                                    Display
                                </button>
                            </div>
                            
                            <table className="table table-bordered table-striped mt-3">
                                <thead>
                                    <tr>
                                        <th width='180px'></th>
                                        <th width='100px' className="text-end">Day</th>
                                        <th className="text-end">Sum Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { billSales.length > 0 ? billSales.map(item => 
                                    <tr>
                                        <td className="text-center">
                                            <button data-toggle='modal' data-target='#modalBillSale' onClick={e => {setCurrentBillSale(item.results)}} className="btn btn-primary"> 
                                                <i className="fa fa-file-alt me-2"/>
                                                Bill
                                            </button>
                                        </td>
                                        <td className="text-end">{item.day}</td>
                                        <td className='text-end'>{(item.sum).toLocaleString('th-TH')}</td>
                                    </tr>
                                    ): ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Template>

            <Modal id='modalBillSale' title='BillSale'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width='180px'></th>
                            <th className="text-end">No.</th>
                            <th>Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBillSale.length > 0 ? currentBillSale.map(item => 
                        <tr>
                            <td className="text-center">
                                <button data-toggle='modal' data-target='#modalBillSaleDetail' onClick={e => setBillSaleDetails(item.billsaleDetails)} className="btn btn-primary">
                                    <i className="fa fa-file-alt me-2"/>
                                    Details
                                </button>
                            </td>
                            <td className="text-end">{item.id}</td>
                            <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                        </tr>
                        ):''}
                    </tbody>
                </table>
            </Modal>

            <Modal id='modalBillSaleDetail' title='Details' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th className="text-center">Item</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Sum Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billSaleDetails.length > 0 ? billSaleDetails.map(item => 
                        <tr>
                            <td className="text-center">{item.product.name}</td>
                            <td className="text-end">{parseInt(item.product.price).toLocaleString('th-TH')}</td>
                            <td className="text-end">{item.qty}</td>
                            <td className="text-end">{parseInt(item.qty*item.product.price).toLocaleString('th-TH')}</td>
                        </tr>
                        ):''}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}

export default SumSalePerDay;