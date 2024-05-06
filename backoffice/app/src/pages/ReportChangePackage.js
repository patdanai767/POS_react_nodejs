import { useEffect, useState } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';
import Modal from '../components/Modal';

function ReportChangePackage() {
    const [members, setMembers] = useState([]);
    const [hours, setHours] = useState(() => {
        let arr = [];

        for (let i = 0; i <= 23; i++) {
            arr.push(i);
        }

        return arr;
    });
    const [minutes, setMinutes] = useState(() => {
        let arr = [];

        for (let i = 0; i <= 59; i++) {
            arr.push(i);
        }

        return arr;
    });
    const [remark, setRemark] = useState('');
    const [payDate, setPayDate] = useState(() => {
        const myDate = new Date();
        if (myDate.getDate() < 10 && myDate.getMonth() < 9) {
            return (
                myDate.getFullYear() +
                "-0" +
                (myDate.getMonth() + 1) +
                "-0" +
                myDate.getDate()
            );
        } else if (myDate.getDate() < 10 && myDate.getMonth() >= 9) {
            return (
                myDate.getFullYear() +
                "-" +
                (myDate.getMonth() + 1) +
                "-0" +
                myDate.getDate()
            );
        } else if (myDate.getDate() >= 10 && myDate.getMonth() < 9) {
            return (
                myDate.getFullYear() +
                "-0" +
                (myDate.getMonth() + 1) +
                "-" +
                myDate.getDate()
            );
        } else {
            return (
                myDate.getFullYear() +
                "-" +
                (myDate.getMonth() + 1) +
                "-" +
                myDate.getDate()
            );
        }

    });
    const [payHour, setPayHour] = useState(() => {
        const d = new Date();
        return d.getHours();
    });
    const [payMinute, setPayMinute] = useState(() => {
        const d = new Date();
        return d.getMinutes();
    });
    const [changePackage, setChangePackage] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/changePackage/list', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setMembers(res.data.results);
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
        let payload = {
            payDate: payDate,
            payHour: payHour,
            payMinute: payMinute,
            remark: remark,
            id: changePackage.id
        };

        console.log(payload);
        try {
            await axios.post(config.api_path + '/changePackage/saveChange', payload, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        title: 'Save',
                        text: 'Saved data',
                        icon: 'success',
                        timer: 1000
                    });

                    fetchData();

                    let btns = document.getElementByClassName('btnClose');
                    for(let i = 0; i < btns.length; i++) btns[i].click();
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
    };

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title h5">Report member who need to change package</div>
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Date want to change</th>
                                    <th>New Package</th>
                                    <th className="text-end">Cost per monthly</th>
                                    <th width='150px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? members.map(item =>
                                    <tr>
                                        <td>{item.member.name}</td>
                                        <td>{item.member.phone}</td>
                                        <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                        <td>{item.package.name}</td>
                                        <td className="text-end">{parseInt(item.package.price).toLocaleString('th-TH')}</td>
                                        <td className="text-center">
                                            <button onClick={e => setChangePackage(item)} data-bs-toggle='modal' data-bs-target='#modalPay' className="btn btn-success">
                                                <i className="fa fa-check me-2" />
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalPay' title='Save data'>
                <div>
                    <label>Payment date</label>
                    <input value={payDate} onChange={e => setPayDate(e.target.value)} className="form-control" type='date' />
                </div>
                <div className="mt-3">
                    <label>Time</label>
                    <div className="row">
                        <div className="col-6">
                            <div className="input-group">
                                <div className="input-group-text">Hour</div>
                                <select value={payHour} onChange={e => setPayHour(e.target.value)} className='form-control'>
                                    {hours.length > 0 ? hours.map(item =>
                                        <option value={item}>{item}</option>
                                    ) : ''}
                                </select>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="input-group">
                                <div className="input-group-text">Minute</div>
                                <select value={payMinute} onChange={e => setPayMinute(e.target.value)} className="form-control">
                                    {minutes.length > 0 ? minutes.map(item =>
                                        <option value={item}>{item}</option>
                                    ) : ''}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <label>Note</label>
                    <input onChange={e => setRemark(e.target.value)} className="form-control" />
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

export default ReportChangePackage;