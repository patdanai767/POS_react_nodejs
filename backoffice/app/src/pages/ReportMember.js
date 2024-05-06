import { useState, useEffect } from "react";
import Template from "../components/Template";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import * as dayjs from 'dayjs';

function ReportMember() {
    const [members, setMembers] = useState([]);
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async() => {
        try{
            await axios.get(config.api_path + '/member/list' , config.headers()).then(res => {
                if(res.data.message === 'success'){
                    setMembers(res.data.results);
                }
            })
        }catch(e){
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
                <div className="card-header h5">
                    Report Member
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Register data</th>
                                <th>Package</th>
                            </tr>
                        </thead>
                        <tbody>
                            { members.length > 0 ? members.map(item => 
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.phone}</td>
                                <td>{dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                                <td>{item.package.name}</td>
                            </tr>
                            ): ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </Template>
        </>
      );
}

export default ReportMember;