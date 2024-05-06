import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

function Template(props) {
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();

    const [usr, setUsr] = useState('');
    const [pwd, setPwd] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/admin/info', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setAdmin(res.data.result);
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

    const handleSignOut = () => {
        Swal.fire({
            title: 'Sign Out',
            text: 'Do you want to sign out ?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(res => {
            if (res.isConfirmed) {
                localStorage.removeItem(config.token_name);
                navigate('/');
            }
        })
    }

    const handleChangeProfile = () => {
        Swal.fire({
            title: 'Change Profile',
            text: 'Are u sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if (res.isConfirmed) {
                const payload = {
                    usr: usr,
                    id: admin.id
                }
                if (pwd != '') {
                    payload.pwd = pwd;
                }
                try {
                    await axios.post(config.api_path + '/admin/changeProfile', payload, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Changed Profile',
                                text: 'Already saved',
                                icon: 'success',
                                timer: 2000
                            }).then(res => {
                                localStorage.removeItem(config.token_name);
                                navigate('/'); //เพื่อเด้งไปหน้า log in

                                const btns = document.getElementsByClassName('btnClose');
                                for(let i =0 ; i < btns.length;i++) btns[i].click();
                            });
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

    return (
        <>
            <div className="d-flex">
                <div className="bg-dark ps-2 pe-3" style={{ height: '100dvh', width: '270px', position: 'fixed', top: 0, left: 0 }}>
                    <div className='text-white'>
                        <span className='mt-3 ms-2 text-warning h5'>{admin.name} : {admin.level}</span>
                        <div className='mt-3 ms-2'>
                            <button onClick={handleSignOut} className='btn btn-outline-danger'>
                                <i className='fa fa-sign-out-alt me-2' />
                                Sign out
                            </button>
                            <button data-bs-toggle='modal' data-bs-target='#modalMyInfo' className='btn btn-outline-info ms-1' onClick={e => setUsr(admin.usr)}>
                                <i className='fa fa-pencil me-2' />
                                Profile
                            </button>
                        </div>
                        <hr className='mt-4' />
                    </div>
                    <div className='d-grid gap-3 mt-2'>
                        <Link to='/Home' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-dashboard me-2' />
                            Dashboard
                        </Link>
                        <Link to='/reportMember' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-file-alt me-2' />
                            Report register
                        </Link>
                        <Link to='/reportChangePackage' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-file-alt me-2' />
                            Report change package
                        </Link>
                        <Link to='/reportSumSalePerDay' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-file-alt me-2' />
                            Report daily income
                        </Link>
                        <Link to='/reportSumSalePerMonth' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-file-alt me-2' />
                            Report monthly income
                        </Link>
                        <Link to='/reportSumSalePerYear' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-file-alt me-2' />
                            Report annual income
                        </Link>
                        <Link to='/admin' className='btn btn-default text-start text-secondary my-menu'>
                            <i className='fa fa-user me-2' />
                            User Admin
                        </Link>
                    </div>
                </div>
                <div className="p-3" style={{ width: "100%", overflowY: 'auto', marginLeft: '270px' }}>
                    {props.children}
                </div>
            </div>

            <Modal id='modalMyInfo' title='Profile'>
                <div>
                    <label>Username</label>
                    <input onChange={e => setUsr(e.target.value)} value={usr} className='form-control' />
                </div>
                <div className='mt-3'>
                    <label>Password</label>
                    <input onChange={e => setPwd(e.target.value)} type='password' className='form-control' />
                </div>
                <div className='mt-3'>
                    <button onClick={handleChangeProfile} className='btn btn-primary'>
                        <i className='fa fa-check me-2' />
                        Save
                    </button>
                </div>
            </Modal>
        </>
    );
}

export default Template;