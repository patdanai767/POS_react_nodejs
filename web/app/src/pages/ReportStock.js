import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function ReportStock() {
    const [stocks, setStocks] = useState([]);
    const [currentStock, setCurrentStock] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/stock/report', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setStocks(res.data.results);
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

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Report Stock</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Item</th>
                                    <th className="text-end">Stock In</th>
                                    <th className="text-end">Stock Out</th>
                                    <th className="text-end">Stock Left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.length > 0 ? stocks.map(item =>
                                    <tr>
                                        <td>{item.result.barcode}</td>
                                        <td>{item.result.name}</td>
                                        <td className="text-end">
                                            <a onClick={e => setCurrentStock(item)} data-toggle='modal' data-target='#modalStockIn' className="btn btn-link text-success">
                                                {item.stockIn}
                                            </a>
                                        </td>
                                        <td className="text-end">
                                            <a onClick={e => setCurrentStock(item)} data-toggle='modal' data-target='#modalStockOut' className="btn btn-link text-danger">
                                                {item.stockOut}
                                            </a>
                                        </td>
                                        <td className="text-end">{(item.stockIn - item.stockOut).toLocaleString('th-TH')}</td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalStockIn' title='Details of stock in' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width = '100px'>Barcode</th>
                            <th>Item</th>
                            <th className="text-end">Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStock.result != undefined && currentStock != {} && currentStock.result.stocks.length > 0 ? currentStock.result.stocks.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{item.qty}</td>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
            
            <Modal id='modalStockOut' title='Details of stock out' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width = '100px'>Barcode</th>
                            <th>Item</th>
                            <th className="text-end">Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStock.result != undefined && currentStock != {} && currentStock.result.billsaleDetails.length > 0 ? currentStock.result.billsaleDetails.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{item.qty}</td>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}

export default ReportStock;