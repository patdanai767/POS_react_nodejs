import Template from "../components/Template";
import Swal from 'sweetalert2';
import config from '../config';
import axios from 'axios';
import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function Product() {

    const [product, setProduct] = useState({});
    const [products, setProducts] = useState([]);
    const [productImage, setProductImage] = useState({});
    const [productImages, setProductImages] = useState([]);

    useEffect(() => {
        fetchData();
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
                icon: 'error',
            })


        }
    }

    const clearForm = () => {
        setProduct({
            name: '',
            details: '',
            price: '',
            funding: '',
            barcode: ''
        });
    }

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            let url = config.api_path + '/product/insert';
            if (product.id !== undefined) {
                url = config.api_path + '/product/update';
            }

            await axios.post(url, product, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    Swal.fire({
                        tilte: 'Saved',
                        text: 'Already saved',
                        icon: 'success',
                        timer: 2000
                    })
                    fetchData();
                    clearForm();
                    handleClose();

                    document.getElementById('btnModalClose').click();
                }
            })
        } catch (e) {
            Swal.fire({
                tilte: 'error',
                text: e.message,
                icon: 'error'
            })
        }
    }

    const handleClose = () => {
        const btns = document.getElementsByClassName('btnClose');
        for (let i = 0; i < btns.length; i++) {
            btns[i].click();
        }
    }

    const handleDelete = (item) => {

        Swal.fire({
            title: 'Delete Goods',
            text: 'Are u sure ?',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    await axios.delete(config.api_path + '/product/delete/' + item.id, config.headers()).then(res => {
                        if (res.data.message === 'success') {
                            fetchData();
                            Swal.fire({
                                title: 'Delete Data',
                                text: 'Already deleted',
                                icon: 'success',
                                timer: 2000
                            })
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
        })

    }

    const handleChangeFile = (files) => {
        setProductImage(files[0]);
    }

    const handleUpload = () => {
        Swal.fire({
            title: 'Upload Picture',
            text: 'Please, be sure with upload this picture',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            if (res.isConfirmed) {
                try {
                    const _config = {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem(config.token_name),
                            'content-Type': 'multipart/form-data'
                        }
                    }
                    const formData = new FormData();
                    formData.append('productImage', productImage);
                    formData.append('productImageName', productImage.name);
                    formData.append('productId', product.id);

                    await axios.post(config.api_path + '/productImage/insert', formData, _config).then(res => {
                        if (res.data.message === 'success') {
                            Swal.fire({
                                title: 'Upload Image Goods',
                                text: 'Upload success',
                                icon: 'success',
                                timer: 2000
                            })

                            fetchDataProductImage({id:product.id});

                            const btns = document.getElementsByClassName('btnClose');

                            for (let i = 0; i < btns.length; i++) btns[i].click();
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
                } catch (e) {
                    Swal.fire({
                        tilte: 'error',
                        text: e.message,
                        icon: 'error'
                    })
                }
            }
        })

    }

    const fetchDataProductImage = async (item) => {
        try {
            await axios.get(config.api_path + '/productImage/list/' + item.id, config.headers()).then(res => {
                if (res.data.message === 'success') {
                    setProductImages(res.data.results);
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
        setProduct(item);
        fetchDataProductImage(item);
    }

    const handleChooseMainImage = (item) => {
        Swal.fire({
            title: 'Choose Main Picture',
            text: 'This picture will be main picture for goods',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true
        }).then(async res => {
            try {
                const url = config.api_path + '/productImage/chooseMainImage/' + item.id + '/' + item.productId;

                await axios.get(url, config.headers()).then(res => {
                    if (res.data.message === 'success') {
                        fetchDataProductImage({
                            id: item.productId
                        });

                        Swal.fire({
                            title: 'Choose Main Picture',
                            text: 'Main Picture is Saved',
                            icon: 'success',
                            timer: 2000
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
        })
    }

    const handleDeleteProductImage = (item) => {
        try{
            Swal.fire({
                title: 'Delete Image',
                text: 'Are you sure to detete image',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true
            }).then(async res => {
                if(res.isConfirmed){
                    await axios.delete(config.api_path + '/productImage/delete/' + item.id, config.headers()).then(res => {
                        if(res.data.message === 'success'){
                            fetchDataProductImage({id: item.productId});
                        }
                    }).catch(err => {
                        throw err.response.data;
                    })
                }
            })

        }catch(e){
            Swal.fire({
                title:'error',
                text:e.message,
                icon:'error'
            })
        }
    }

    return (
        <>
            <Template>
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">Goods</div>
                    </div>
                    <div className="card-body">
                        <button onClick={clearForm} data-toggle='modal' data-target='#modalProduct' className="btn btn-primary">
                            <i className="fa fa-plus mr-2" />
                            Add Goods
                        </button>

                        <table className="mt-3 table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Funding</th>
                                    <th>Details</th>
                                    <th width='170px'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.map(item =>
                                    <tr>
                                        <td>{item.barcode}</td>
                                        <td>{item.name}</td>
                                        <td className="text-right">{parseInt(item.price).toLocaleString('th-TH')}</td>
                                        <td className="text-right">{parseInt(item.funding).toLocaleString('th-TH')}</td>
                                        <td>{item.details}</td>
                                        <td className="text-center">
                                            <button onClick={e => handleChooseProduct(item)} data-toggle='modal' data-target='#modalProductImage' className="btn btn-primary mr-2">
                                                <i className="fa fa-image" />
                                            </button>
                                            <button onClick={e => setProduct(item)} data-toggle='modal' data-target='#modalProduct' className="btn btn-info mr-2">
                                                <i className="fa fa-pencil" />
                                            </button>
                                            <button onClick={e => handleDelete(item)} className="btn btn-danger">
                                                <i className="fa fa-times" />
                                            </button>
                                        </td>
                                    </tr>
                                ) : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Template>

            <Modal id='modalProduct' title='Add Goods' modalSize='modal-lg'>
                <form onSubmit={handleSave}>
                    <div className="row">
                        <div className="mt-3 col-2">
                            <label>Barcode</label>
                            <input value={product.barcode} onChange={e => setProduct({ ...product, barcode: e.target.value })} className="form-control" />
                        </div>
                        <div className="mt-3 col-10">
                            <label>Name</label>
                            <input value={product.name} onChange={e => setProduct({ ...product, name: e.target.value })} className="form-control" />
                        </div>
                        <div className="mt-3 col-2">
                            <label>Price</label>
                            <input value={product.price} onChange={e => setProduct({ ...product, price: e.target.value })} className="form-control" />
                        </div>

                        <div className="mt-3 col-2">
                            <label>Funding</label>
                            <input value={product.funding} onChange={e => setProduct({ ...product, funding: e.target.value })} className="form-control" />
                        </div>

                        <div className="mt-3 col-8">
                            <label>Details</label>
                            <input value={product.details} onChange={e => setProduct({ ...product, details: e.target.value })} className="form-control" />
                        </div>
                    </div>

                    <div className="mt-3">
                        <button onClick={handleSave} className="btn btn-primary">
                            <i className="fa fa-check mr-2" />
                            Save
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal id='modalProductImage' title='Picture' modalSize='modal-lg'>
                <div className="row">
                    <div className="col-4">
                        <div className="input-group">
                            <div className="input-group-text">Barcode</div>
                            <input value={product.barcode} disabled className="form-control" />
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="input-group">
                            <div className="input-group-text">Name</div>
                            <input value={product.name} disabled className="form-control" />
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <div className="input-group">
                            <div className="input-group-text">Details</div>
                            <input value={product.details} disabled className="form-control" />
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <div className="mb-1">Select Image</div>
                        <input onChange={e => handleChangeFile(e.target.files)} type='file' name='imageName' className="form-control" />
                    </div>
                </div>
                <div className="mt-3">
                    {productImage.name !== undefined ?
                        <button onClick={handleUpload} className="btn btn-primary">
                            Confirm
                            <i className="fa fa-check ml-2"></i>
                        </button>
                        : ''}
                </div>

                <div className="mt-2">Picture</div>
                <div className="row">
                    {productImages.length > 0 ? productImages.map(item =>
                        <div className="col-4" key={item.id}>
                            <div className="card">
                                <img src={config.api_path + '/uploads/' + item.imageName} width='100%' alt="" />
                                <div className="card-body text-center">
                                    {item.isMain ?

                                        <botton className="btn btn-info mr-2">
                                            <i className="fa fa-check mr-2" />
                                            Main Picture
                                        </botton>

                                        :

                                        <button onClick={e => handleChooseMainImage(item)} className="btn btn-default mr-2">
                                            Main Picture
                                        </button>

                                    }
                                    <botton onClick={e => handleDeleteProductImage(item)} className="btn btn-danger">
                                        <i className="fa fa-times" />
                                    </botton>
                                </div>
                            </div>
                        </div>
                    ) : ''}
                </div>
            </Modal>
        </>
    )
}

export default Product;