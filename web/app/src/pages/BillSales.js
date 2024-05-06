import Template from "../components/Template";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function BillSales() {
    const [billSales, setBillSales] = useState([]);
    const [selectBill, setSelectBill] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async() => {
        try{
            await axios.get(config.api_path + '/billSale/list', config.headers()).then(res => {
                if(res.data.message === 'success'){
                    setBillSales(res.data.results)
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
                        <div className="card-title">Reports bill</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead className="h6">
                                <td width='120px'></td>
                                <td width='100px'>No.bill</td>
                                <td>Date</td>
                            </thead>
                            <tbody>
                                { billSales.length > 0 ? billSales.map(item => 
                                <tr>
                                    <td className="text-center">
                                        <button data-toggle='modal' data-target='#modalBillSaleDetail' onClick={e => setSelectBill(item)} className="btn btn-primary">
                                            <i className="fa fa-file-alt me-2"/>
                                            Note
                                        </button>
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                </tr>
                                ): ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalBillSaleDetail' title='Billing Note' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th width='100px' className="text-end">Price</th>
                            <th width='100px' className="text-end">Amount</th>
                            <th width='100px' className="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        { selectBill != {} && selectBill.billsaleDetails != null ? selectBill.billsaleDetails.map(item => 
                        <tr>
                            <td>{item.product.name}</td>
                            <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                            <td className="text-end">{item.qty}</td>
                            <td className="text-end">{(item.qty*item.price).toLocaleString('th-TH')}</td>
                        </tr>
                        ): ''}
                    </tbody>
                </table>
            </Modal>
        </>
     );
}

export default BillSales ;