import Template from "../components/Template";
import Swal from "sweetalert2";
import axios from "axios";
import { useState, useEffect } from "react";
import config from "../config";
import Modal from "../components/Modal";

function Admin() {
    const [level, setLevel] = useState(() => {
        return ['admin', 'sub admin'];
    });
    const [selectedLevel, setSelectedLevel] = useState("admin");
    const [name, setName] = useState('');
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [admins, setAdmins] = useState([]);
    const [id, setId] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/admin/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setAdmins(res.data.results);
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

    const handleSave = async () => {
        if (password != confirmPassword) {
            Swal.fire({
                title: 'Password are not the same',
                text: 'Please, check it again',
                icon: 'error',
                timer: 2000
            })
        } else {
            try {
                const payload = {
                    name: name,
                    usr: user,
                    level: selectedLevel,
                    email: email
                };

                if(password != ''){
                    payload.pwd = password;
                }

                let url = '/admin/create';

                if(id > 0) {
                    url = '/admin/edit/'+id;
                }

                await axios.post(config.api_path + '/admin/create', payload, config.headers()).then(res => {
                    if (res.data.message === 'success') {
                        Swal.fire({
                            title: 'Saved',
                            text: 'Already saved',
                            icon: 'success',
                            timer: 2000
                        })

                        const btns = document.getElementsByClassName('btnClose');
                        for (let i = 0; i < btns.length; i++) btns[i].click();

                        fetchData();

                        setId(0);
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

    const handleDelete = (item) => {
        Swal.fire({
            title: 'Delete user',
            text: 'Are you sure?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/admin/delete/' + item.id, config.headers()).then(res => {
                        if(res.data.message === 'success'){
                            Swal.fire({
                                title:'Delete is success',
                                text:'Already deleted',
                                icon:'success',
                                timer: 2000
                            })

                            fetchData();
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

    const handleSelectedAdmin = (item) => {
        setSelectedLevel(item.level);
        setName(item.name);
        setUser(item.usr);
        setEmail(item.email);
        setId(item.id);
    }

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title h5">Admin User</div>
                    </div>
                    <div className="card-body">
                        <button data-bs-toggle='modal' data-bs-target='#modalForm' className="btn btn-primary">
                            <i className="fa fa-plus me-2" />
                            Add
                        </button>

                        <table className="table table-bordered table-striped mt-3">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>User</th>
                                    <th>Level</th>
                                    <th>Email</th>
                                    <th width='105px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.length > 0 ? admins.map(item =>
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.usr}</td>
                                        <td>{item.level}</td>
                                        <td>{item.email}</td>
                                        <td className="text-center">
                                            <button onClick={e => handleSelectedAdmin(item)} data-bs-toggle='modal' data-bs-target='#modalForm' className="btn btn-primary me-1">
                                                <i className="fa fa-pencil" />

                                            </button>
                                            <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                <i className="fa fa-trash-alt" />

                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalForm' title='Add user admin' modalSize='modal-lg'>
                <div>
                    <label>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="form-control" />
                </div>
                <div className="mt-3">
                    <label>Username</label>
                    <input value={user} onChange={e => setUser(e.target.value)} className="form-control" />
                </div>
                <div className="mt-3">
                    <label>Password</label>
                    <input onChange={e => setPassword(e.target.value)} type='password' className="form-control" />
                </div>
                <div className="mt-3">
                    <label>Confirm password</label>
                    <input onChange={e => setConfirmPassword(e.target.value)} type="password" className="form-control" />
                </div>
                <div className="mt-3">
                    <label>Level</label>
                    <select value={selectedLevel} onChange={e => setSelectedLevel(e.target.value)} className="form-control">
                        {level.map(item =>
                            <option>{item}</option>
                        )}
                    </select>
                </div>
                <div className="mt-3">
                    <label>Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
                </div>
                <div className="mt-3">
                    <button onClick={handleSave} className="btn btn-primary">
                        <i className="fa fa-check me-2" />
                        Save
                    </button>
                </div>
            </Modal>

            
        </>
    );
}

export default Admin;