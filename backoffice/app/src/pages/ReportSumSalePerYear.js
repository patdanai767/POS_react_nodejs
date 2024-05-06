import Template from "../components/Template";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import * as dayjs from "dayjs";
import Modal from "../components/Modal";

function ReportSumSalePerYear() {
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState({});

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            await axios.get(config.api_path + '/changePackage/reportSumSalePerYear', config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setResults(res.data.results);
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
                        <div className="card-title h5">Report year income</div>
                    </div>
                    <div className="card-body">
                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th width='200px' className="text-end">Income</th>
                                    <th width='200px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.length > 0 ? results.map(item =>
                                    <tr>
                                        <td>{item.year}</td>
                                        <td className="text-end">{parseInt(item.sum).toLocaleString('th-TH')}</td>
                                        <td className="text-center">
                                            <botton onClick={e => setSelectedResult(item)} data-bs-toggle='modal' data-bs-target='#modalInfo' className="btn btn-success">
                                                <i className="fa fa-file-alt me-2" />
                                                Info
                                            </botton>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalInfo' title='Info' modalSize='modal-lg'>
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Date register</th>
                            <th>Date paid</th>
                            <th>Member</th>
                            <th>Package</th>
                            <th className="text-end">Cost per year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedResult != {} && selectedResult.results != undefined && selectedResult.results.length > 0 ? selectedResult.results.map(item =>
                            <tr>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{dayjs(item.payDate).format('DD/MM/YYYY')} {item.payHour}:0{item.payMinute}</td>
                                <td>{item.member.name}</td>
                                <td>{item.package.name}</td>
                                <td className="text-end">{parseInt(item.package.price).toLocaleString('th-TH')}</td>
                            </tr>
                        ) : ''}
                    </tbody>
                </table>
            </Modal>
        </>
    );
}

export default ReportSumSalePerYear;