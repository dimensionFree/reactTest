import React, { useState, useEffect } from "react";
import "../css/navibar.css";
import RequestSendUtils from "../Utils/RequestSendUtils";
import {useHistory} from "react-router-dom";
// import 'bootstrap/js/dist/dropdown'
const Navibar = () => {
    const [username, setUsername] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(""); // 新增用于保存搜索输入的状态
    const history = useHistory(); // 使用 useNavigate 代替 useHistory

    const quit = () => {
        RequestSendUtils.quitUser();
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            const { id, username, role } = userInfo.user4Display;
            const token = userInfo.token;

            RequestSendUtils.sendGet(`/user/find/${id}`, token, (response) => {
                if (response.status === 200) {
                    console.log(response.data.message);
                }
            }, () => {
                RequestSendUtils.quitUser();
            });

            setUsername(username);
            setIsAdmin(role.roleName === "admin");
            setUserId(id);
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value); // 更新输入框的值
    };

    const handleSearchClick = (e) => {
        e.preventDefault();

        if (searchKeyword.trim() !== "") {
            // window.location.href = "/article/search/" + searchKeyword


            history.push("/article/search/" + searchKeyword);
        }
    };

    const userAvaterContent = !username ? (
        <a className="nav-link ml-auto" style={{ color: "white" }} href="/login">sign in/sign up</a>
    ) : (
        <div className="d-flex justify-content-between ml-auto">
            <a className="btn btn-primary btn-lg" href="/article/edit/NEW" role="button">create article</a>
            <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-expanded="false">
                    welcome, {username}!
                </a>
                <div className="dropdown-menu" aria-labelledby="dropdown01">
                    {isAdmin && <a className="dropdown-item" href="/userManage">user management</a>}
                    <a className="dropdown-item" href={`/articleManage/${userId}`}>article management</a>
                    <a className="dropdown-item" onClick={quit} href="#">quit</a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="Navibar">
            <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <a className="navbar-brand" href="/">Home</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarsExampleDefault"
                        aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExampleDefault">


                    {/*<ul className="navbar-nav mr-auto">*/}
                    {/*    <li className="nav-item active">*/}
                    {/*        <a className="nav-link" href="/" hidden={true}>article <span className="sr-only">(current)</span></a>*/}
                    {/*    </li>*/}
                    {/*    <li className="nav-item active">*/}
                    {/*        <a className="nav-link" href="/" hidden={true}>catalog <span className="sr-only">(current)</span></a>*/}
                    {/*    </li>*/}
                    {/*    /!*<li className="nav-item">*!/*/}
                    {/*    /!*    <a className="nav-link disabled">Disabled</a>*!/*/}
                    {/*    /!*</li>*!/*/}
                    {/*    /!*<li className="nav-item dropdown">*!/*/}
                    {/*    /!*    <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown"*!/*/}
                    {/*    /!*       aria-expanded="false">Dropdown</a>*!/*/}
                    {/*    /!*    <div className="dropdown-menu" aria-labelledby="dropdown01">*!/*/}
                    {/*    /!*        <a className="dropdown-item" href="#">Action</a>*!/*/}
                    {/*    /!*        <a className="dropdown-item" href="#">Another action</a>*!/*/}
                    {/*    /!*        <a className="dropdown-item" href="#">Something else here</a>*!/*/}
                    {/*    /!*    </div>*!/*/}
                    {/*    /!*</li>*!/*/}
                    {/*</ul>*/}


                    {/*<form className="form-inline my-2 my-lg-0 mr-3 ml-auto">*/}
                    {/*    <input className="form-control mr-sm-2" type="text" placeholder="Search"*/}
                    {/*           aria-label="Search"/>*/}
                    {/*    <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>*/}
                    {/*</form>*/}





                    {/*<div className="d-flex ml-auto">*/}
                    {/*    <input*/}
                    {/*        className="form-control mr-sm-2"*/}
                    {/*        type="text"*/}
                    {/*        placeholder="Search"*/}
                    {/*        aria-label="Search"*/}
                    {/*        value={searchKeyword} // 绑定输入框值*/}
                    {/*        onChange={handleSearchChange} // 输入框变化时更新状态*/}
                    {/*    />*/}
                    {/*    <button className="btn btn-secondary my-2 my-sm-0" onClick={handleSearchClick}>Search</button>*/}
                    {/*</div>*/}
                    <form className="form-inline my-2 my-lg-0 mr-3 ml-auto" onSubmit={handleSearchClick}>
                        <input
                            className="form-control mr-sm-2"
                            type="text"
                            placeholder="Search"
                            aria-label="Search"
                            value={searchKeyword} // 绑定输入框值
                            onChange={handleSearchChange} // 输入框变化时更新状态
                        />
                        <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                    </form>




                    {userAvaterContent}
                </div>
            </nav>
        </div>
    );
};

export default Navibar;
