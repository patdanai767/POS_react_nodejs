import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { Link } from "react-router-dom";
import Modal from "./Modal";


const SideBar = forwardRef((props, sidebarRef) => {

    const [memberName, setMemberName] = useState();
    const [packageName, setPackageName] = useState();
    const [packages, setPackages] = useState([]);
    const [totalBill, setTotalBill] = useState(0);
    const [billAmount, setBillAmount] = useState(0);
    const [banks, setBanks] = useState([]);
    const [choosePackage, setChoosePackage] = useState({});

    useEffect(() => {
        fetchData();
        fetchDataTotalBill();
        fetchDataBank();
    }, [])

    const fetchDataTotalBill = async () => {
        try {
            await axios.get(config.api_path + '/package/countBill', config.headers()).then(res => {
                if (res.data.totalBill != undefined) {
                    setTotalBill(res.data.totalBill)
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

    const fetchData = async () => {
        try {
            axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setMemberName(res.data.result.name);
                    setPackageName(res.data.result.package.name);
                    setBillAmount(res.data.result.package.bill_amount);
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

    const fetchPackages = async () => {
        try {
            await axios.get(config.api_path + '/package/list', config.headers()).then(res => {
                if (res.data.results.length > 0) {
                    setPackages(res.data.results);
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

    const renderButton = (item) => {
        if (packageName == item.name) {
            return (
                <button className="btn btn-success disabled">
                    <i className="fa fa-check me-2" />
                    Choose
                </button>
            )
        } else {
            return (
                <button onClick={e => handleChoosePackage(item)} data-toggle='modal' data-target='#modalBank' className="btn btn-primary">
                    <i className="fa fa-check me-2" />
                    Choose
                </button>
            );
        }

    }

    const handleChoosePackage = (item) => {
        setChoosePackage(item);
        fetchDataBank();
    }

    const fetchDataBank = async () => {
        if (banks.length == 0) {
            try {
                await axios.get(config.api_path + '/bank/list', config.headers()).then(res => {
                    if (res.data.message === 'success') {
                        setBanks(res.data.results);
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
    }

    const handleChangePackage = async() => {
        try{
            await axios.get(config.api_path + '/package/changePackage/' + choosePackage.id , config.headers()).then(res => {
                if(res.data.message === 'success'){
                    Swal.fire({
                        title:'Saved',
                        text:'Submit change request package',
                        icon:'success',
                        timer: 2000
                    })

                    const btns = document.getElementsByClassName('btnClose');
                    for(let i=0; i< btns.length; i++) btns[i].click();
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

    useImperativeHandle(sidebarRef, () => ({
        refreshCountBill(){
            fetchDataTotalBill();
        }
    }))

    return (
        <>
            <aside className="main-sidebar sidebar-dark-primary elevation-4">

                <a href="index3.html" className="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                    <span className="brand-text font-weight-light">POS on Cloud</span>
                </a>

                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <img src="dist/img/user2-160x160.jpg" className="img-circle elevation-2" alt="User Image" />
                        </div>
                        <div className="info text-white">

                            <div className="h5">{memberName}</div>
                            <div>Package : {packageName}</div>
                            <div className="d-grid">
                                <button onClick={fetchPackages} data-toggle='modal' data-target='#modalPackage' type='button' className="btn btn-warning mt-2 btn-sm">
                                    <i className="fa fa-arrow-up me-2" />
                                    Upgrade
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="ms-2 me-2 text-white">
                            <div className="float-start">
                                {totalBill} / {billAmount.toLocaleString('th-TH')}
                            </div>
                            <div className="float-end">
                                {(totalBill * 100 / billAmount)}%
                            </div>
                        </div>
                        <div className="clearfix"></div>
                        <div className="progress ms-2 me-2">
                            <div className="progress-bar" role="progressbar" style={{ width: (totalBill * 100 / billAmount) + '%' }} aria-valuenow={totalBill} aria-valuemin='0' aria-valuemax='100'></div>
                        </div>
                    </div>

                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

                            <li className="nav-item">
                                <a href="pages/widgets.html" className="nav-link">
                                    <i className="nav-icon fas fa-th"></i>
                                    <p>
                                        Dashboard
                                    </p>
                                </a>
                            </li>
                            <li className='nav-item'>
                                <Link to='/sale' className="nav-link">
                                    <i className="nav-icon fa fa-dollar-sign" />
                                    <p>Sale</p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/product" className="nav-link">
                                    <i className="nav-icon fas fa-box"></i>
                                    <p>
                                        Items
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/user" className="nav-link">
                                    <i className="nav-icon fas fa-person"></i>
                                    <p>
                                        User
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sumSalePerDay" className="nav-link">
                                    <i className="nav-icon fas fa-file-alt"></i>
                                    <p>
                                        Report Sale
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/billSales" className="nav-link">
                                    <i className="nav-icon fas fa-list-alt"></i>
                                    <p>
                                        All bills
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/stock" className="nav-link">
                                    <i className="nav-icon fas fa-box"></i>
                                    <p>
                                        Stock
                                    </p>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/stockReport" className="nav-link">
                                    <i className="nav-icon fas fa-file"></i>
                                    <p>
                                        StockReport
                                    </p>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                </div>

            </aside>

            <Modal id='modalPackage' title='Choose Package' modalSize='modal-lg'>
                <div className="row">
                    {packages.length > 0 ? packages.map(item =>
                        <div className="col-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="h4">{item.name}</div>
                                    <div className="mt-3 h6"><strong className="text-blue">{parseInt(item.price).toLocaleString('th-TH')} ฿</strong> / Month</div>
                                    <div className="mt-3">Bills <span className="text-red">{parseInt(item.bill_amount).toLocaleString('th-TH')}</span> / Month</div>
                                    <div className="mt-3 text-center">
                                        {renderButton(item)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </Modal>

            <Modal id='modalBank' title='Payment Channels' modalSize='modal-lg'>
                <div className="h4 text-secondary">
                    Change <span className="text-success">{packageName}</span> to <span className="text-primary">{choosePackage.name}</span>
                </div>
                <div className="mt-3 h5">
                    Cost : <span className="text-danger">{parseInt(choosePackage.price).toLocaleString('th-TH')}</span> ฿ / Month
                </div>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Bank</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banks.length > 0 ? banks.map(item =>
                            <tr>
                                <td>{item.bankType}</td>
                                <td>{item.bankCode}</td>
                                <td>{item.bankName}</td>
                                <td>{item.bankBranch}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>

                <div className="alert mt-3 alert-warning">
                    <i className="fa fa-info-circle me-2" />
                    Please, notice in line ID: pattproc
                </div>

                <div className="text-center mt-3">
                    <button onClick={handleChangePackage} className="btn btn-success">
                        <i className="fa fa-check me-2" />
                        Confirm
                    </button>
                </div>
            </Modal>
        </>
    )
    })


export default SideBar;