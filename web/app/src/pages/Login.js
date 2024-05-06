import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';
import config from '../config';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [phone, setPhone] = useState();
    const [pass, setPass] = useState();
    
    const navigate = useNavigate();

    const handleSignIn = async() => {
        try{
            const payload = {
                phone:phone,
                pass:pass
            }
            await axios.post(config.api_path + '/member/signin', payload).then(res=>{
                if(res.data.message === 'success'){
                    Swal.fire({
                        title: 'Sign In',
                        text: 'Welcome Sir!',
                        icon: 'success',
                        timer: 2000
                    })

                    localStorage.setItem(config.token_name, res.data.token);
                    
                    navigate('/home');
                    
                }else{
                    Swal.fire({
                        title: 'Sign In',
                        text: 'Wrong!',
                        icon: 'warning',
                        timer: 2000
                    })
                }
            }).catch(err => {
                throw err.response.data;
            })
        } catch (e){
            Swal.fire ({
                title: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }
    return (
        <>

            <div className="card container mt-5">
                <div className="card-header">
                    <div className="card-title mt-3 h4">Login to POS</div>
                </div>
                <div className="card-body">
                    <div>
                        <label>Telephone</label>
                        <input className="form-control" onChange={e=> setPhone(e.target.value)} />
                    </div>


                    <div className="mt-3">
                        <label>Password</label>
                        <input type="password" className="form-control" onChange={e=> setPass(e.target.value)} />

                        <div className="mt-2 mb-3">
                            <button onClick={handleSignIn} className="btn btn-primary btn-sm">
                                <i className="fa fa-check" style={{ marginRight: '10px' }} />
                                Sign in
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login;