import config from "../config";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useState } from "react";
import axios from "axios";

function Navbar() {
    const navigate = useNavigate();
    const [memberName, setMemberName] = useState();

    const handleSignOut = () => {

        Swal.fire({
            title: 'sign out',
            text: 'Are u sure to sign out',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true

        }).then(res => {
            if(res.isConfirmed){
                localStorage.removeItem(config.token_name);
                navigate('/login');
            }
        })
    }
    
    const handleEditProfile = async() => {
        try {
            await axios.get(config.api_path + '/member/info', config.headers()).then(res => {
                if(res.data.message === 'success'){
                    setMemberName(res.data.result.name);
                }
            }).catch (err => {
                throw err.response.data;
            })
        } catch (e) {
            Swal.fire ({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleChangeProfile = async() => {
        try{
            await axios.put(config.api_path + '/member/changeProfile' , {memberName:memberName}, config.headers()).then(res => {
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'Change Data',
                        text: 'Change name shop is done',
                        icon:'success',
                        timer: 2000
                    })
                }
            })

        }catch (e) {
            Swal.fire ({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }


    return (
        <>

            <nav class="main-header navbar navbar-expand navbar-white navbar-light">

                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                    </li>
                </ul>

                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <button onClick={handleEditProfile} data-toggle='modal' data-target='#modalEditProfile'
                         className="btn btn-info mr-2">
                            <i className="fa fa-user mr-2"></i>
                            Profile
                        </button>
                        <button onClick={handleSignOut} className="btn btn-danger">
                            <i className="fa fa-times mr-2"></i>
                            Sign out
                        </button>
                    </li>
                </ul>

            </nav>

            <Modal id='modalEditProfile' title='Edit'>
                <div>
                    <label>Name Shop</label>
                    <input value={memberName} onChange={e => setMemberName(e.target.value)} className='form-control'/>
                </div>
                <div className='mt-3'>
                    <button onClick={handleChangeProfile} className='btn btn-primary'>
                        <i className='fa fa-check mr-2'></i>
                        Save
                    </button>
                </div>
            </Modal>
        </>
    )
}

export default Navbar;