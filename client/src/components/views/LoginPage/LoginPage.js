import axios from 'axios';
// import { response } from 'express';
import React, { useState } from 'react'

function LoginPage() {
    const [UserId, setUserId] = useState("");

    const onUserIdHandler = (event) => {
        setUserId(event.currentTarget.value)
    };

    const onSubmitHandler = (event) => {
        event.preventDefault(); //submit 버튼이 눌렸을 때 뷰가 새로고침 되는 것을 방지
        let body = {
            _id: UserId
        }

        axios.post('/api/user/login', body).then(response => {
            console.log(response.data);
        });
    };

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form onSubmit={onSubmitHandler}>
                <label>User ID: </label>
                <input type="text" value={UserId} onChange={onUserIdHandler} />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default LoginPage
