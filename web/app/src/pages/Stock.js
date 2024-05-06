import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from 'dayjs';

function Stock() {
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");
    const [productId, setProductId] = useState(0)
    const [qty, setQty] = useState(0);
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        fetchDataStock();

    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/product/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProducts(res.data.results);

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

    const fetchDataStock = async () => {
        try {
            await axios.get(config.api_path + '/stock/list', config.headers()).then(res => {
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

    const handleChooseProduct = (item) => {
        setProductName(item.name);
        setProductId(item.id);

        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) btns[i].click();
    }

    const handleSave = async () => {
        try {
            const payload = {
                qty: qty,
                productId: productId,
            }

            await axios.post(config.api_path + '/stock/save', payload, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    fetchDataStock();

                    Swal.fire({
                        title: 'Saved',
                        text: 'Already get item to stock',
                        timer: 1000,
                        icon: 'success'
                    })
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

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete Stock?',
            text: 'Are u sure?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true
        }).then(async res => {
            try {
                if (res.isConfirmed) {
                    await axios.delete(config.api_path + '/stock/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            fetchDataStock();

                            Swal.fire({
                                title: 'Deleted',
                                text: 'Already deleted',
                                icon: 'success',
                                timer: 1000
                            })
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
                }
            } catch (e) {
                Swal.fire({
                    title: 'error',
                    text: e.message,
                    icon: 'error'
                })
            }
        
        })
    }

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Get Item to Stock</div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-4">
                                <div className="input-group">
                                    <span className="input-group-text">Item</span>
                                    <input value={productName} disabled className="form-control" />
                                    <button onClick={fetchData} data-toggle='modal' data-target='#modalProduct' className="btn btn-primary">
                                        <i className="fa fa-search" />
                                    </button>
                                </div>
                            </div>
                            <div className="col-2">
                                <div className="input-group">
                                    <span className="input-group-text">Amount</span>
                                    <input onChange={e => setQty(e.target.value)} type="number" className="form-control" />
                                </div>
                            </div>
                            <div className="col-6">
                                <button onClick={handleSave} className="btn btn-primary">
                                    <i className="fa fa-check me-2" />
                                    Save
                                </button>
                            </div>
                        </div>
                        <table className="table table-bordered table-striped mt-3">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Item</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th width='120px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.length > 0 ? stocks.map(item =>
                                    <tr>
                                        <td>{item.product.barcode}</td>
                                        <td>{item.product.name}</td>
                                        <td>{item.qty}</td>
                                        <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="text-center">
                                            <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                <i className="fa fa-times me-2" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalProduct' title='Choose Item' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th width='180px'></th>
                            <th>Barcode</th>
                            <th>Item</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? products.map(item =>
                            <tr>
                                <td className="text-center">
                                    <button onClick={e => handleChooseProduct(item)} className="btn btn-primary">
                                        <i className="fa fa-check me-2" />
                                        Choose
                                    </button>
                                </td>
                                <td>{item.barcode}</td>
                                <td>{item.name}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}

export default Stock;