import { useState, useEffect } from "react";
import axios from 'axios';
import config from '../config';
import Modal from '../components/Modal';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function Package() {
    const [packages, setPackages] = useState([]);
    const [yourPackage, setyourPackage] = useState({});
    const [name, setName] = useState([]);
    const [phone, setPhone] = useState([]);
    const [pass, setPass] = useState();

    const navigate = useNavigate(); //navigate เอาไว้เปลี่ยน pages ไป page อื่น

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            axios.get(config.api_path + '/package/list').then(res => {
                setPackages(res.data.results);
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e) {
            console.log(e.message);
        }
    }

    const choosepackage = (item) => {
        setyourPackage(item);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            Swal.fire({
                title: 'Register is Successful',
                text: 'Please be sure for accept our package',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(res => {
                if (res.isConfirmed) {
                    const payload = {
                        packageId: yourPackage.id,
                        name: name,
                        phone: phone,
                        pass: pass
                    }
                    axios.post(config.api_path + '/package/memberRegister', payload).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Already Saved',
                                text: 'Saved Data',
                                icon: 'success',
                                timer: 2000
                            })


                            navigate('/login');
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
                }
            })
            const btns = document.getElementsByClassName('btnClose');
            for (let i = 0; i < btns.length; i++) btns[i].click();

        } catch (e) {
            Swal.fire({
                title: 'error',
                message: e.message,
                icon: 'error'
            })
            console.log(e.message);
        }
    }



    return (
        <>
            <div className="container">
                <div className="h2 text-secondary">PatrPOS : Point of Sale on Cloud</div>
                <div className="h5">Package for You</div>
                <div className="row">
                    {packages.map(item =>
                        <div className="col-4">
                            <div className="card">
                                <div className="card-body text-center">
                                    <div className="h4 text-warning">{item.name}</div>
                                    <div className="h5">
                                        {parseInt(item.bill_amount).toLocaleString('th-TH')}
                                        &nbsp;
                                        ฿ per month
                                    </div>
                                    <div className="h5 text-secondary">
                                        {parseInt(item.price).toLocaleString('th-TH')}
                                        &nbsp;
                                        ฿
                                    </div>
                                    <div className="mt-3">
                                        <button onClick={e => choosepackage(item)} data-bs-toggle='modal' className="btn btn-primary" data-bs-target="#modalRegister">Register</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Modal id="modalRegister" title="Register">
                <form onSubmit={handleRegister}>
                    <div>
                        <label className="h5">Package</label>
                        <div className="alert alert-info">{yourPackage.name} price {yourPackage.price} per month</div>
                    </div>
                    <div>
                        <label>Shop Name</label>
                        <input className="form-control mt-1 mb-1" onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Tel.</label>
                        <input className="form-control mt-1 mb-1" onChange={e => setPhone(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input className="form-control mt-1 mb-1" type="password" onChange={e => setPass(e.target.value)} />
                    </div>
                    <div>
                        <button className="mt-3 btn btn-primary" onClick={handleRegister}>
                            Accept
                            <i className="fa fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                        </button>

                    </div>
                </form>
            </Modal>
        </>
    )
}

export default Package;