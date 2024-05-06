import { useEffect, useRef, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs'

function Sale() {
    const [products, setProducts] = useState([]);
    const [billSale, setBillSale] = useState({});
    const [currentBill, setcurrentBill] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [item, setItem] = useState({});
    const [inputMoney, setInputMoney] = useState(0);
    const [lastBill, setLastBill] = useState({});
    const [billToday, setbillToday] = useState([]);
    const [selectedBill, setSelectedBill] = useState({});

    const saleRef = useRef();

    useEffect(() => {
        fetchData();
        openBill();
        fetchBillSaleDetail();
    }, []);

    const fetchBillSaleDetail = async () => {
        try {

            await axios.get(config.api_path + '/billSale/currentBillInfo', config.headers()).then(res => {
                if (res.data.results !== null) {
                    setcurrentBill(res.data.results);
                    sumTotalPrice(res.data.results.billsaleDetails);
                }
            })
        } catch (e) {
            Swal.fire({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const sumTotalPrice = (billsaleDetails) => {
        let sum = 0;
        for (let i = 0; i < billsaleDetails.length; i++) {
            const item = billsaleDetails[i];
            const qty = parseInt(item.qty);
            const price = parseInt(item.price);

            sum += (qty * price)
        }
        setTotalPrice(sum);
    }

    const openBill = async () => {
        try {
            await axios.get(config.api_path + '/billSale/openBill', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setBillSale(res.data.result);
                }
            })
        } catch (e) {
            Swal.fire({
                tilte: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/listForSale', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results);
                }
            }).catch((err) => {
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

    const handleSave = async (item) => {
        try {
            await axios.post(config.api_path + '/billSale/Sale', item, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    fetchBillSaleDetail();
                }
            })
        } catch (e) {
            Swal.fire({
                tilte: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete',
            text: 'Are u sure to delete this item',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                await axios.delete(config.api_path + '/billSale/deleteItem/' + item.id, config.headers()).then(res => {
                    if (res.data.message === 'success') {
                        fetchBillSaleDetail();
                    }
                })
            }
        })
    }

    const handleUpdateQty = async () => {
        try {
            await axios.post(config.api_path + '/billSale/updateQty', item, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    let btns = document.getElementsByClassName('btnClose');

                    for (let i = 0; i < btns.length; i++) {
                        btns[i].click();
                    }
                    Swal.fire({
                        title: 'Success',
                        text: 'Saved',
                        icon: 'success',
                        timer: 2000
                    })
                    fetchBillSaleDetail();
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

    const handleEndSale = () => {
        Swal.fire({
            title: 'End of Sale',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.get(config.api_path + '/billSale/endSale', config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Already End',
                                text: 'Thank you!',
                                icon: 'success',
                                timer: 1000
                            })
                            setTotalPrice(0);
                            setcurrentBill();
                            openBill();
                            fetchBillSaleDetail();

                            let btns = document.getElementsByClassName('btnClose');

                            for (let i = 0; i < btns.length; i++) btns[i].click();

                            if(saleRef.current){
                                saleRef.current.refreshCountBill();
                            }
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
        })
    }

    const handleLastBill = async () => {
        try {
            await axios.get(config.api_path + '/billSale/lastBill', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setLastBill(res.data.result[0])
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

    const handleBillToday = async () => {
        try {
            await axios.get(config.api_path + '/billSale/billToday', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setbillToday(res.data.results)
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
            <Template ref={saleRef}>
                <div className="card">
                    <div className="card-header">
                        <div className="float-start h4 mt-1">Sale Goods</div>
                        <div className="float-end">
                            <button data-toggle='modal' data-target='#modalEndSale' className="btn btn-success">
                                <i className="fa fa-check me-2"></i>Success
                            </button>
                            <button onClick={handleBillToday} data-toggle='modal' data-target='#modalBillToday' className="btn btn-info ms-2">
                                <i className="fa fa-file me-2" />Bill Today
                            </button>
                            <button onClick={handleLastBill} data-toggle='modal' data-target='#modalLastBill' className="btn btn-secondary ms-2">
                                <i className="fa fa-file-alt me-2" />Latest Bill
                            </button>
                        </div>
                        <div className="float-none" />
                    </div>
                    <div className="card-body">

                        <div className="row">
                            <div className="col-9">
                                <div className="row">
                                    {products.length > 0 ? products.map(item =>
                                        <div className="col-3" onClick={e => handleSave(item)}>
                                            <div className="card mt-3">
                                                <img className="card-img-top" width='100px' height='200px' src={config.api_path + '/uploads/' + item.productImages[0].imageName} />
                                                <div className="card-body">
                                                    <div className="text-green">{item.name}</div>
                                                    <div className="mt-3">{parseInt(item.price).toLocaleString('th-TH')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : ''}
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="">
                                    <div className="h2 ps-3 pe-3 text-end pt-2 pb-2" style={{ color: '#70FE3F', backgroundColor: 'black' }}>{totalPrice.toLocaleString('th-TH')}</div>
                                    {currentBill != null && currentBill.billsaleDetails != undefined && currentBill.billsaleDetails.length > 0 ? currentBill.billsaleDetails.map(item =>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="h6">{item.product.name}</div>
                                                <div>
                                                    <strong className="text-danger me-4">{item.qty}</strong>
                                                    x
                                                    <span className="ms-4 me-4">{parseInt(item.price).toLocaleString('th-TH')}</span>
                                                    =
                                                    <span className="ms-4 me-4">{parseInt(item.qty * item.price).toLocaleString('th-TH')}</span>
                                                </div>
                                                <div className="text-center mt-1">
                                                    <button onClick={e => setItem(item)} data-toggle='modal' data-target='#modalQty' className="btn btn-primary me-2">
                                                        <i className="fa fa-pencil" />
                                                    </button>
                                                    <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                        <i className="fa fa-times" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : ''}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </Template>
            <Modal id='modalQty' title='EditQuatity'>
                <div>
                    <label>Amount</label>
                    <input value={item.qty} onChange={e => setItem({ ...item, qty: e.target.value })} className="form-control" />
                    <div className="mt-3">
                        <button onClick={handleUpdateQty} className="btn btn-primary">
                            <i className="fa fa-check me-2" />Save
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal id='modalEndSale' title='Endsale'>
                <div>
                    <div>
                        <label>Balance</label>
                    </div>
                    <div>
                        <input
                            value={totalPrice.toLocaleString('th-TH')}
                            disabled
                            className="form-control text-end" />
                    </div>
                    <div className="mt-2">
                        <label>Receive</label>
                    </div>
                    <div>
                        <input
                            value={inputMoney}
                            onChange={e => setInputMoney(e.target.value)}
                            className="form-control text-end" />
                    </div>
                    <div className="mt-2">
                        <label>Change</label>
                    </div>
                    <div>
                        <input
                            value={(inputMoney - totalPrice).toLocaleString('th-TH')}
                            disabled
                            className="form-control text-end" />
                    </div>
                    <div className="text-center mt-3">
                        <button onClick={() => setInputMoney(totalPrice)} className="btn btn-primary me-2">
                            <i className="fa fa-exchange me-2" />
                            Exact change
                        </button>
                        <button onClick={handleEndSale} className="btn btn-success">
                            <i className="fa fa-check me-2" />
                            Accept
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal id='modalLastBill' title='Lastest Bill' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Barcode</th>
                            <th>Item</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lastBill.billsaleDetails != undefined ? lastBill.billsaleDetails.map(item =>
                            <tr>
                                <td>{item.product.barcode}</td>
                                <td>{item.product.name}</td>
                                <td className="text-end">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                <td className="text-end">{item.qty}</td>
                                <td>{(item.price * item.qty).toLocaleString('th-TH')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>

            <Modal id='modalBillToday' title='Bill Today' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width='120px'></th>
                            <th>No.</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billToday.length > 0 ? billToday.map(item =>
                            <tr>
                                <td className="text-center">
                                    <button onClick={e => setSelectedBill(item)} data-toggle='modal' data-target='#modalBillSaleDetail' className="btn btn-primary">
                                        <i className="fa fa-eye me-2" />
                                        View
                                    </button>
                                </td>
                                <td>{item.id}</td>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm:ss')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>

            <Modal id='modalBillSaleDetail' title='Detail of bill' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Barcode</th>
                            <th>Item</th>
                            <th className="text-end">Price</th>
                            <th className="text-end">Amount</th>
                            <th className="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedBill !={} && selectedBill.billsaleDetails != undefined && selectedBill.billsaleDetails.length > 0 ? selectedBill.billsaleDetails.map(item => 
                        <tr>
                            <td>{item.product.barcode}</td>
                            <td>{item.product.name}</td>
                            <td className="text-end">{item.price}</td>
                            <td className="text-end">{item.qty}</td>
                            <td className="text-end">{item.price*item.qty}</td>
                        </tr>
                        ):''}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default Sale;