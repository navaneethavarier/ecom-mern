import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import Base from '../core/Base';
import { createSingleCategory } from "./helper/adminapicall";

const AddCategory = () => {

    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const {user, token} = isAuthenticated();

    const goBack = () =>(
        <div className="mt-5">
            <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
        </div>
    )

    const handleChange = e =>{
        setError("");
        setName(e.target.value);

    }

    const onSubmit = e =>{
        e.preventDefault();
        setError("");
        setSuccess(false);

        createSingleCategory(user._id, token, {name})
            .then(data => {
                if(data.error){
                    setError(true)
                }
                else{
                    setError("");
                    setSuccess(true);
                    setName("");
                }
            })
    }

    const successMessage = () =>{
        if(success){
            return (
                <h4 className="text-success">Category created successfully!</h4>
            )
        }
    }

    const warningMessage = () =>{
        if(error){
            return (
                <h4 className="text-warning">Failed to create category</h4>
            )
        }
    }

    const myCategoryForm = () => {
        return(
            <form>
                <div className="form-group">
                    <p className="lead">Enter the category</p>
                    <input 
                    type="text"
                    className="form-control my-3"
                    onChange={handleChange}
                    value={name}
                    autoFocus
                    required
                    placeholder="For eg, Summer"
                    />
                    <button onClick={onSubmit} className="btn btn-outline-info">Create Category</button>
                </div>
            </form>
        )
    }

    return (
        <Base title="Create a category" description="Add a new category for tshirts" className="container bg-info p-4">
            <div className="row bg-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {myCategoryForm()}
                    {goBack()}
                </div>
            </div>
        </Base>
    )
}

export default AddCategory;